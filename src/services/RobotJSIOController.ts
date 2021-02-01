import IKeyboardIOController from "./interfaces/IKeyboardIOController";
import IMouseIOController, { MouseClickKey, MousePosition } from "./interfaces/IMouseIOController";
import robot from 'robotjs';

export default class RobotJSIOController implements IMouseIOController, IKeyboardIOController {
    keyboardHold(key: string): void {
        robot.keyTap(key, "down");
    }

    keyboardRelease(key: string): void {
        robot.keyTap(key, "up");
    }

    mouseHold(key: MouseClickKey): void {
        robot.mouseToggle("down", key);
    }

    mouseRelease(key: MouseClickKey): void {
        robot.mouseToggle("up", key);
    }
    
    getMousePosition(): MousePosition {
        return robot.getMousePos()
    }

    click(key: MouseClickKey): void {
        robot.mouseClick(key)
    }

    scroll(toPosition: MousePosition): void {
        let {x, y} = toPosition
        robot.scrollMouse(x, y)
    }

    move(toPosition: MousePosition): void {
        let {x, y} = toPosition
        robot.moveMouseSmooth(x, y)
    }

    press(key: string): void {
        robot.keyTap(key);
    }
}