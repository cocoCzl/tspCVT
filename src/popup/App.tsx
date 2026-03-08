import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)
dayjs.locale('zh-cn')

// Copy Icon Component
const CopyIcon = ({ copied }: { copied: boolean }) => (
  <svg 
    className={`w-4 h-4 transition-all duration-200 ${copied ? 'text-green-400' : 'text-gray-400 hover:text-white'}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    {copied ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    )}
  </svg>
)

// Copy Button Component
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button 
      onClick={handleCopy}
      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 active:scale-95"
      title="复制"
    >
      <CopyIcon copied={copied} />
    </button>
  )
}

function App() {
  // Real-time timestamp
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now())
  
  // Timestamp to Date
  const [timestampInput, setTimestampInput] = useState('')
  const [convertedDate, setConvertedDate] = useState('')
  
  // Date to Timestamp
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [selectedTime, setSelectedTime] = useState(dayjs().format('HH:mm:ss'))
  const [timestamp10, setTimestamp10] = useState('')
  const [timestamp13, setTimestamp13] = useState('')

  // Update real-time timestamp every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now())
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Auto-detect and convert timestamp
  useEffect(() => {
    if (!timestampInput.trim()) {
      setConvertedDate('')
      return
    }

    const input = timestampInput.trim()
    const num = parseInt(input, 10)
    
    if (isNaN(num)) {
      setConvertedDate('无效输入')
      return
    }

    let timestamp = num
    // Auto-detect: if 10 digits, treat as seconds; if 13 digits, treat as milliseconds
    if (input.length === 10) {
      timestamp = num * 1000
    } else if (input.length !== 13) {
      setConvertedDate('请输入10位或13位时间戳')
      return
    }

    const date = dayjs(timestamp)
    if (!date.isValid()) {
      setConvertedDate('无效时间戳')
      return
    }

    setConvertedDate(date.format('YYYY-MM-DD HH:mm:ss'))
  }, [timestampInput])

  // Convert date to timestamp
  useEffect(() => {
    const dateTime = dayjs(`${selectedDate} ${selectedTime}`)
    if (dateTime.isValid()) {
      const ms = dateTime.valueOf()
      setTimestamp13(ms.toString())
      setTimestamp10(Math.floor(ms / 1000).toString())
    }
  }, [selectedDate, selectedTime])

  return (
    <div className="w-80 min-h-[480px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Header - Real-time timestamp */}
      <header className="relative p-4 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-300/80 mb-1">当前时间戳</p>
            <p className="font-mono text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentTimestamp}
            </p>
          </div>
          <CopyButton text={currentTimestamp.toString()} />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {dayjs(currentTimestamp).format('YYYY-MM-DD dddd HH:mm:ss.SSS')}
        </p>
      </header>

      <main className="relative p-4 space-y-5">
        {/* Section A: Timestamp to Date */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-purple-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            时间戳 → 日期
          </h2>
          
          <div className="space-y-2">
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="输入10位或13位时间戳..."
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-mono placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200"
            />
            
            {convertedDate && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <span className="font-mono text-sm">{convertedDate}</span>
                <CopyButton text={convertedDate} />
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <span className="text-xs text-gray-500">转换</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>

        {/* Section B: Date to Timestamp */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-purple-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            日期 → 时间戳
          </h2>
          
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200 [color-scheme:dark]"
            />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              step="1"
              className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200 [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            {/* 10-digit timestamp */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div>
                <span className="text-xs text-blue-300/80">10位 (秒)</span>
                <p className="font-mono text-sm">{timestamp10}</p>
              </div>
              <CopyButton text={timestamp10} />
            </div>
            
            {/* 13-digit timestamp */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
              <div>
                <span className="text-xs text-emerald-300/80">13位 (毫秒)</span>
                <p className="font-mono text-sm">{timestamp13}</p>
              </div>
              <CopyButton text={timestamp13} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-2 text-center">
          <p className="text-xs text-gray-500">
            tspCVT · 时间戳转换器
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
