import IKeyboardIOController from "../../../services/interfaces/IKeyboardIOController";
import IMacroPlayer from "../../../services/interfaces/IMacroPlayer";
import FullMatchAction from "../abstracts/FullMatchAction";

export default class MacroAction extends FullMatchAction {
    private controller: IMacroPlayer;

    public constructor(controller: IMacroPlayer) {
        super(controller.getMacroList())
        this.controller = controller
    }

    do(command: string): void {
        if (this.controller.isPlaying(command)) return
        this.controller.play(command)
    }
    
}