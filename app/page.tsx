"use client"

import { useState, useEffect } from "react"
import { Check, Key, Wallet, Shield, Zap, RefreshCw, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Extensão da interface Window para o TypeScript
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

interface Benefit {
  icon: React.ReactNode
  text: string
}

interface Plan {
  name: string
  price: number
  originalPrice: number
  benefits: Benefit[]
  buttonText: string
  link: string
  isHighlighted?: boolean
  badge?: string
}

function createBenefit(type: string, text: string): Benefit {
  const icons: Record<string, React.ReactNode> = {
    key: <Key className="w-3.5 h-3.5" />,
    wallet: <Wallet className="w-3.5 h-3.5" />,
    shield: <Shield className="w-3.5 h-3.5" />,
    zap: <Zap className="w-3.5 h-3.5" />,
    refresh: <RefreshCw className="w-3.5 h-3.5" />,
    check: <Check className="w-3.5 h-3.5" />,
  }

  return {
    icon: icons[type] || icons.check,
    text,
  }
}

const plans: Plan[] = [
  {
    name: "Bank Pix Pro Max",
    price: 729,
    originalPrice: 1479,
    benefits: [
      createBenefit("key", "Chave personalizada"),
      createBenefit("wallet", "Limite de saque por dia: 50.000 MZN"),
      createBenefit("shield", "Conta garantida"),
      createBenefit("zap", "Levantamento instantaneo (M-pesa e E-mola)"),
      createBenefit("refresh", "Atualizacoes automaticas"),
    ],
    buttonText: "Quero Bank Pix Pro Max",
    link: "https://pay.kambafy.com/checkout/e8ab6f89-80dc-49c1-b937-c19c3a704ba8",
    isHighlighted: true,
    badge: "Melhor Oferta",
  },
]

function PlanCard({ name, price, originalPrice, benefits, buttonText, link, isHighlighted = false, badge }: Plan) {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  return (
    <div className={`relative flex flex-col rounded-2xl p-6 transition-all duration-500 ${isHighlighted ? "bg-gradient-to-b from-[#2a1a1a] to-[#1a0a0a] border-2 border-[#ff4d4d] md:scale-105 shadow-2xl shadow-[#ff4d4d]/20 animate-glow-pulse" : "bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-[#333] hover:border-[#00ff88]/50 hover:shadow-lg hover:shadow-[#00ff88]/10"}`}>
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff8800] to-[#ff4d4d] text-white text-sm font-bold shadow-lg">
            <Sparkles className="w-4 h-4" />
            {badge}
          </div>
        </div>
      )}
      <div className="text-center mb-6 pt-2">
        <h3 className="text-xl font-bold text-white">{name}</h3>
      </div>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-gray-500 line-through text-lg">{originalPrice} MZN</span>
          <span className="px-2 py-0.5 rounded-full bg-[#00ff88]/10 text-[#00ff88] text-xs font-bold">-{discount}%</span>
        </div>
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-4xl font-bold ${isHighlighted ? "text-[#00ff88]" : "text-white"}`}>{price}</span>
          <span className="text-gray-400 text-lg">MZN</span>
        </div>
      </div>
      <div className="flex-1 space-y-4 mb-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isHighlighted ? "bg-[#00ff88]/20 text-[#00ff88]" : "bg-[#333] text-[#00ff88]"}`}>
              {benefit.icon}
            </div>
            <span className="text-gray-300 text-sm leading-relaxed">{benefit.text}</span>
          </div>
        ))}
      </div>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block"
        onClick={() => {
          if (typeof window !== "undefined" && window.fbq) {
            window.fbq('track', 'InitiateCheckout', { content_name: name });
          }
        }}
      >
        <Button size="lg" className={`w-full h-14 text-base font-bold rounded-xl transition-all duration-300 cursor-pointer ${isHighlighted ? "bg-gradient-to-r from-[#00ff88] to-[#00cc6a] hover:from-[#00cc6a] hover:to-[#00ff88] text-black shadow-lg shadow-[#00ff88]/30" : "bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white border border-[#333] hover:border-[#00ff88]"}`}>
          {buttonText}
        </Button>
      </a>
    </div>
  )
}

function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  useEffect(() => {
    const storedEndTime = localStorage.getItem("bankpix_timer_end")
    let endTime = storedEndTime ? parseInt(storedEndTime, 10) : Date.now() + 15 * 60 * 1000
    if (!storedEndTime) localStorage.setItem("bankpix_timer_end", endTime.toString())

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
      setTimeRemaining(remaining)
      if (remaining <= 0) {
        const newEndTime = Date.now() + 15 * 60 * 1000
        localStorage.setItem("bankpix_timer_end", newEndTime.toString())
      }
    }
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  if (timeRemaining === null) return null
  const mins = Math.floor(timeRemaining / 60)
  const secs = timeRemaining % 60
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#333] text-gray-300">
      <Check className="w-4 h-4 text-[#ff4d4d]" />
      <span className="text-sm">Tempo restante:</span>
      <span className="font-mono font-bold text-[#ff4d4d]">{mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}</span>
    </div>
  )
}

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Script do Facebook Pixel corrigido
      !(function(f,b,e,v,n,t,s){
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
      }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js'));

      window.fbq('init', '829061486173119');
      window.fbq('track', 'PageView');
      window.fbq('track', 'ViewContent', { content_name: 'Sales Page' });
    }
  }, []); // <-- AQUI estava o erro, agora está fechado corretamente!

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff4d4d]/5 rounded-full blur-[150px]" />
      </div>

      <header className="relative py-6 px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00aa55] flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold">Bank Pix</span>
          </div>
      </header>

      <section className="relative px-4 py-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Escolha seu plano</h1>
          <p className="text-gray-400 text-lg mb-6">Tenha acesso a chaves personalizadas e saques instantâneos.</p>
          <CountdownTimer />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-center">
          {plans.map((plan) => (
            <div key={plan.name} className="w-full max-w-md">
              <PlanCard {...plan} />
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Tem dúvidas? Fale conosco</p>
          <a
            href="https://wa.me/258842118909?text=Tenho%20d%C3%BAvidas%20sobre%20como%20obter%20o%20aplicativo%20BankPix"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold hover:scale-105 transition-all"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </section>
    </main>
  )
}
