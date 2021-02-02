
export default interface IMacroRecorder {
    record: () => void
    delete: (macroName: string) => void
}