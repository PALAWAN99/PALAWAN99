import Cocoa

/// Native launcher so KKU Card API appears in the Dock with Quit (Cmd+Q / right-click).
final class AppDelegate: NSObject, NSApplicationDelegate {
    private var worker: Process?

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.regular)

        guard let execURL = Bundle.main.executableURL else {
            NSApp.terminate(nil)
            return
        }
        let workerURL = execURL
            .deletingLastPathComponent()
            .appendingPathComponent("kku-card-api-worker")

        let task = Process()
        task.executableURL = workerURL
        task.arguments = []
        do {
            try task.run()
            worker = task
        } catch {
            let alert = NSAlert(error: error)
            alert.messageText = "KKU Card API"
            alert.informativeText = "Could not start Card API worker."
            alert.runModal()
            NSApp.terminate(nil)
        }
    }

    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        guard let worker, worker.isRunning else {
            return .terminateNow
        }
        worker.terminate()
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            self?.worker?.waitUntilExit()
            DispatchQueue.main.async {
                NSApp.reply(toApplicationShouldTerminate: true)
            }
        }
        return .terminateLater
    }
}

let delegate = AppDelegate()
let app = NSApplication.shared
app.delegate = delegate
_ = NSApplicationMain(CommandLine.argc, CommandLine.unsafeArgv)
