import IMacroPlayer from "./interfaces/IMacroPlayer";
import IMacroRecorder from "./interfaces/IMacroRecorder";
import util from 'util'
import WebServerController from "../controllers/WebServerController";
const exec = util.promisify(require('child_process').exec);

async function listCommands(): Promise<string[] | undefined> {
    const { stdout, stderr } = await exec('python ./macroRecorder/commandline.py -n dummy -c list');
    if (stderr) return

    return JSON.parse(stdout.replace(/'/g, "\"")) as string[]
}

async function recordMacro(name: string) {
    const { stderr } = await exec(`python ./macroRecorder/commandline.py -n "${name}" -c record`);
    if (stderr) console.log('record macro error:', stderr);
}

async function playMacro(name: string) {
    const { stderr } = await exec(`python ./macroRecorder/commandline.py -n "${name}" -c play`);
    if (stderr) console.log('play macro error:', stderr);
}

async function removeMacro(name: string) {
    const { stderr } = await exec(`python ./macroRecorder/commandline.py -n "${name}" -c remove`);
    if (stderr) console.log('remove macro error:', stderr);
}

async function renameMacro(oldname: string, newName: string) {
    const { stderr } = await exec(`python ./macroRecorder/commandline.py -n "${oldname}" -c update -t "${newName}"`);
    if (stderr) console.log('remove macro error:', stderr);
}

export default class MacroManager implements IMacroRecorder, IMacroPlayer {
    private avaliableMacros: string[]
    private static instance?: IMacroRecorder & IMacroPlayer
    private isRecord: boolean
    private playingMacro: Map<string, boolean>

    public constructor() {
        this.avaliableMacros = []
        this.isRecord = false
        this.playingMacro = new Map()
        this.loadMacro()
    }

    public static getInstance(): IMacroRecorder & IMacroPlayer {
        if (!this.instance) this.instance = new MacroManager()
        return this.instance
    }

    private async loadMacro() {
        const macros: string[] | undefined = await listCommands()
        if (!macros) {
            this.avaliableMacros = []
            return
        }

        this.avaliableMacros = macros
        WebServerController.getInstance().sendMacros(this.avaliableMacros)
    }

    public play(marcoName: string){
        this.playingMacro.set(marcoName, true)
        playMacro(marcoName).then(() => {
            this.playingMacro.delete(marcoName)
        })
    }

    public isPlaying(macroName: string): boolean {
        return this.playingMacro.has(macroName)
    }

    public isAnyMacroPlaying(): boolean {
        return this.playingMacro.size > 0
    }

    public getMacroList(): string[] {
        return this.avaliableMacros
    }
    
    public async record(marcoName: string){
        if (this.isRecord) return
        await recordMacro(marcoName)
        this.loadMacro()
    }

    public async update(oldName: string, newName: string) {
        await renameMacro(oldName, newName)
        this.loadMacro()
    }

    public async delete(macroName: string){
        await removeMacro(macroName)
        this.loadMacro()
    }
}