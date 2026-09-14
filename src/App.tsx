import { useState } from "react";
import Hero from "./components/Hero";
import RegistrationModal from "./components/RegistrationModal";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Hero onRegister={() => setIsOpen(true)} />
      <RegistrationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}