import { permanentRedirect } from "next/navigation";

export default function LegacyMusicRoute() {
  permanentRedirect("/musicas-para-pen-drive");
}
