export default function OfflinePage() {
  return (
    <main className="bg-grad-pomodoro grid min-h-dvh place-items-center p-6 text-center">
      <div className="glass px-8 py-10">
        <h1 className="text-2xl font-bold">You&apos;re offline</h1>
        <p className="mt-2 max-w-xs opacity-80">
          CalmTime works offline. Your timer, tasks and stats are saved on this device. Reconnect to
          stream lo-fi radio.
        </p>
      </div>
    </main>
  );
}
