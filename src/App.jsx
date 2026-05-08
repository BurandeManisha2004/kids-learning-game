import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

const questions = [
  {
    question: "आपण काय खातो?",
    answer: "apple",
    speak: "आपण काय खातो?",
    options: [
      { name: "Apple", img: "https://images.pexels.com/photos/588587/pexels-photo-588587.jpeg" },
      { name: "Car", img: "https://images.pexels.com/photos/136872/pexels-photo-136872.jpeg" },
      { name: "Phone", img: "https://m.media-amazon.com/images/I/61xO1VgVJcL.jpg" }
    ]
  },
  {
    question: "आपण काय पितो?",
    answer: "water",
    speak: "आपण काय पितो?",
    options: [
      { name: "Water", img: "https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg" },
      { name: "Home", img: "https://c8.alamy.com/comp/BN50GH/a-typical-house-in-konkan-area-maharastra-BN50GH.jpg" },
      { name: "Light", img: "https://wallpapers.com/images/hd/light-bulb-my2d214cczlezksx.jpg" }
    ]
  }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");

  const recognitionRef = useRef(null);
  const lockRef = useRef(false);
  const audioRef = useRef(null);

  const q = questions[index];

  // 🎵 MUSIC
  useEffect(() => {
    const startMusic = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.25;
        audioRef.current.play().catch(() => {});
      }
    };
    window.addEventListener("click", startMusic, { once: true });
  }, []);

  // 🔊 SPEECH
  const speak = (text, cb) => {
    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    msg.voice = voices.find(v => v.lang.includes("hi")) || voices[0];
    msg.lang = "hi-IN";
    msg.rate = 0.95;
    msg.pitch = 1.2;

    msg.onend = () => cb && cb();

    window.speechSynthesis.speak(msg);
  };

  // 🎤 MIC FIXED
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    recognitionRef.current = rec;

    rec.lang = "hi-IN";
    rec.continuous = false;
    rec.interimResults = false;

    rec.start();

    rec.onresult = (e) => {
      const voice =
        e.results[0][0].transcript.toLowerCase().trim();

      checkAnswer(voice);
    };

    rec.onend = () => {
      if (!lockRef.current) {
        setTimeout(() => rec.start(), 800);
      }
    };
  };

  // 🌟 START
  useEffect(() => {
    speak("🎮 Welcome Kids! चला मजा करूया!", () => startListening());
  }, []);

  // 🔁 QUESTION CHANGE
  useEffect(() => {
    setMessage("");
    lockRef.current = true;

    if (recognitionRef.current) recognitionRef.current.stop();

    setTimeout(() => {
      speak(q.speak, () => {
        lockRef.current = false;
        startListening();
      });
    }, 800);
  }, [index]);

  // ✅ ANSWER CHECK
  const checkAnswer = (voice) => {
    const cleanedVoice = voice
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .trim();

    const cleanedAnswer = q.answer.toLowerCase();

    const isCorrect =
      cleanedVoice.includes(cleanedAnswer) ||
      cleanedAnswer.includes(cleanedVoice);

    if (isCorrect) {
      const msg = `हो ${q.answer} correct answer!👏`;

      setMessage(msg);
      speak(msg);

      confetti({
        particleCount: 300,
        spread: 180,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setIndex((p) => (p + 1) % questions.length);
      }, 2000);

    } else {
      setMessage("😄 पुन्हा प्रयत्न करा!");
      speak("पुन्हा प्रयत्न करा");
    }
  };

  return (
    <>
      {/* 🎵 MUSIC */}
      <audio ref={audioRef} loop>
        <source src="https://www.bensound.com/bensound-music/bensound-littleidea.mp3" />
      </audio>

      {/* 🌈 BACKGROUND */}
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden
        bg-gradient-to-br from-sky-300 via-pink-300 to-yellow-200">

        {/* DECOR */}
        <div className="absolute text-4xl sm:text-5xl top-5 left-5 animate-bounce">☁️</div>
        <div className="absolute text-4xl sm:text-5xl top-10 right-10 animate-bounce">🌈</div>
        <div className="absolute text-4xl sm:text-5xl bottom-10 left-10 animate-bounce">🌟</div>
        <div className="absolute text-4xl sm:text-5xl bottom-5 right-5 animate-bounce">🎊</div>

        {/* TITLE */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-2xl animate-pulse text-center">
          🎮 Kids Cartoon Learning World 🎈
        </h1>

        {/* QUESTION */}
        <div className="mt-6 sm:mt-8 bg-white/90 p-6 sm:p-8 rounded-[40px] shadow-2xl border-4 border-yellow-300 w-[95%] sm:w-[90%] max-w-3xl text-center">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-purple-700">
            {q.question}
          </h2>
        </div>

        {/* OPTIONS GRID (RESPONSIVE FIX) */}
        <div className="mt-8 sm:mt-10 w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">

            {q.options.map((opt, i) => (
              <div
                key={i}
                onClick={() => checkAnswer(opt.name.toLowerCase())}
                className="w-[260px] sm:w-[300px] lg:w-[340px] h-[360px] sm:h-[400px] lg:h-[440px]
                bg-white rounded-[40px] shadow-2xl border-4 border-pink-300
                flex flex-col items-center justify-center hover:scale-105 transition cursor-pointer"
              >
                <img
                  src={opt.img}
                  className="w-[200px] sm:w-[240px] lg:w-[280px] h-[180px] sm:h-[200px] lg:h-[220px]
                  object-cover rounded-3xl shadow-lg"
                />

                <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl lg:text-3xl font-extrabold text-purple-700">
                  {opt.name}
                </h2>
              </div>
            ))}

          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mt-8 sm:mt-10 bg-white px-6 sm:px-10 py-3 sm:py-5 rounded-full text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 animate-bounce shadow-2xl text-center">
            {message}
          </div>
        )}

      </div>
    </>
  );
}