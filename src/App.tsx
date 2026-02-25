import { useState } from 'react';
import { Hero } from './components/Hero';
import { InputForm } from './components/InputForm';
import { Results } from './components/Results';
import { generatePlan } from './services/geminiService';
import { FormData, PlanResult } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePlan(data);
      setPlan(result);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar o plano. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Hero />
      <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
      
      {error && (
        <div className="max-w-xl mx-auto mt-8 p-4 bg-red-50 text-red-600 rounded-lg text-center border border-red-100">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="max-w-xl mx-auto mt-16 text-center">
          <div className="inline-block w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium animate-pulse">Analisando bioma e processando consórcio ideal...</p>
        </div>
      )}

      {!isLoading && plan && <Results plan={plan} />}
    </div>
  );
}
