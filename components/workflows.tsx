import Image from "next/image";
import WorflowImg01 from "@/public/images/workflow-01.png";
import WorflowImg02 from "@/public/images/workflow-02.png";
import WorflowImg03 from "@/public/images/workflow-03.png";
import Spotlight from "@/components/spotlight";

const styles = ["Funk", "Remix", "Paredão", "Automotivo", "Internacional"];
const artists = ["MC GW", "DJ Arana", "MC Cabelinho", "Alok", "Anitta", "Vintage Culture"];

export default function Workflows() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          <div className="mx-auto max-w-3xl pb-10 text-center md:pb-14">
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Veja o pack funcionando na prática
            </h2>
            <p className="text-lg text-indigo-200/75">
              Grave pesado que faz o carro tremer de verdade: organizado em pastas e pronto para tocar.
            </p>
          </div>

          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
            <a className="group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px" href="/formulario">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950/95">
                <Image className="inline-flex" src={WorflowImg01} width={350} height={288} alt="Pasta Funk 2025" loading="lazy" />
                <div className="p-6">
                  <p className="text-sm text-indigo-300">/Funk 2025</p>
                  <p className="text-indigo-200/75">Músicas virais atualizadas com batida automotiva para ligar e sair tocando.</p>
                </div>
              </div>
            </a>

            <a className="group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px" href="/formulario">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950/95">
                <Image className="inline-flex" src={WorflowImg02} width={350} height={288} alt="Pasta Grave pesado" loading="lazy" />
                <div className="p-6">
                  <p className="text-sm text-indigo-300">/Grave pesado</p>
                  <p className="text-indigo-200/75">Faixas ajustadas para paredão com pressão limpa e sem distorção nas frequências graves.</p>
                </div>
              </div>
            </a>

            <a className="group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px" href="/formulario">
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950/95">
                <Image className="inline-flex" src={WorflowImg03} width={350} height={288} alt="Pasta Remix viral" loading="lazy" />
                <div className="p-6">
                  <p className="text-sm text-indigo-300">/Remix viral</p>
                  <p className="text-indigo-200/75">Remixes para rua, festas e viagens com repertório sem repetição e atualizado.</p>
                </div>
              </div>
            </a>
          </Spotlight>

          <div className="mt-10 grid gap-6 rounded-2xl border border-indigo-500/20 bg-gray-900/50 p-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-100">Estilos inclusos</h3>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <span key={style} className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-200">{style}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-100">Artistas mais pedidos (exemplo visual)</h3>
              <p className="text-sm text-indigo-200/70">{artists.join(" • ")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
