import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Users, 
  Receipt, 
  Smartphone, 
  CheckCircle2, 
  ChevronRight, 
  Star,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Receipt size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter italic">Easy-Pay</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#pain-points" className="hover:text-blue-600 transition-colors">El Problema</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Cómo funciona</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonios</a>
            <a href="#comparison" className="hover:text-blue-600 transition-colors">Comparativa</a>
          </div>

          <Link to="/dashboard" className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Entrar
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            La cuenta,<br />
            <span className="text-blue-600">dividida</span> en segundos.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
            Cero estrés. Escanea, asigna y paga tu parte. Olvídate de las calculadoras y disfruta de la sobremesa.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
              Empezar ahora <ChevronRight size={20} />
            </Link>
            <button className="w-full sm:w-auto bg-slate-100 text-slate-900 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-200 transition-all">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section id="pain-points" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tight">El dolor de cabeza de la cuenta ya es historia</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Calculator />, title: "Calculadora infernal", desc: "¿Quién pidió qué? ¿Cuánto es la propina? Deja de hacer sumas en servilletas." },
              { icon: <Users />, title: "Discusiones incómodas", desc: "\"Yo solo comí una ensalada\". Evita el drama de pagar por lo que no consumiste." },
              { icon: <Zap />, title: "Propina Justa", desc: "Calcula la propina justa automáticamente, sin regatear ni quedar mal." },
              { icon: <ShieldCheck />, title: "Tiempo perdido", desc: "Pagar debería tomar segundos, no 20 minutos esperando el datáfono." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black mb-12 tracking-tight">Cómo funciona</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Escanear", desc: "Sube una foto del ticket o introduce el código QR de la mesa." },
                  { step: "02", title: "Asignar", desc: "Toca tus platos o divídelos entre varios comensales." },
                  { step: "03", title: "Calcular", desc: "Impuestos y propinas se calculan al instante." },
                  { step: "04", title: "Pagar", desc: "Paga tu parte con un click desde tu móvil." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-4xl font-black text-blue-100">{item.step}</span>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-600 rounded-[48px] aspect-[4/5] flex items-center justify-center p-12 overflow-hidden relative">
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full border-[40px] border-white rounded-full scale-150" />
              </div>
              <div className="bg-white w-full h-full rounded-[32px] shadow-2xl relative flex items-center justify-center">
                 <Smartphone size={120} className="text-blue-100" />
                 <div className="absolute top-10 right-10 w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={32} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-900 text-white rounded-[64px] mx-6">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Lo que dicen nuestros usuarios</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "Increíblemente fácil de usar. Ya no hay discusiones incómodas al final de la cena.", author: "Carlos M.", role: "Foodie" },
              { text: "La mejor app para salir con amigos. Calculamos la propina justa en segundos.", author: "Sofia R.", role: "Estudiante" },
              { text: "Me encanta que puedo pagar solo por lo que consumí. ¡Adiós a dividir en partes iguales!", author: "Javier L.", role: "Diseñador" }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[40px]">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-blue-500 text-blue-500" />)}
                </div>
                <p className="text-xl leading-relaxed mb-8">"{item.text}"</p>
                <div>
                  <p className="font-bold">{item.author}</p>
                  <p className="text-slate-500 text-sm">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Receipt size={18} />
            </div>
            <span className="font-bold">Easy-Pay</span>
          </div>
          <p className="text-slate-400 text-sm">© 2024 Easy-Pay. Divide y vencerás.</p>
          <div className="flex gap-8 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Instagram</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
