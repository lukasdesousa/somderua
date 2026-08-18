import "aos/dist/aos.css";
import AosInit from "@/components/aos-init";
import Footer from "@/components/ui/footer";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AosInit />
      <main className="relative flex grow flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
