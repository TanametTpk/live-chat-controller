import ICommandSubscriber from "../services/interfaces/ICommandSubscriber";
import ResetableIOController from "../services/interfaces/ResetableIOController";

export default class LocalIOController implements ICommandSubscriber {
    private isRecording: boolean
    private ioController: ResetableIOController

    public constructor(ioController: ResetableIOController) {
        this.isRecording = false
        this.ioController = ioController
    }
    
    public received(commands: string[]){
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];

            if (command === "reset") this.reset()
            else if (command === "record") this.recordMacro()
            else if (command === "stop-record") this.stopRecordMacro()
        }
    }

    private recordMacro() {
        if (this.isRecording) return

        // do something
        this.isRecording = true
    }

    private stopRecordMacro() {
        if (this.isRecording){
            this.isRecording = false
        }
    }

    private reset() {
        console.log("reset io controller");
        this.ioController.reset()
    }
}