import Lottie from "lottie-react";
import loadingAnimation from "./inc/animation_lmdmxyqf.json";
import { ClientOnly } from "./ClientOnly";

export default function Loader() {
  return (
    <ClientOnly fallback={<p>loading...</p>}>
      {() => <Lottie animationData={loadingAnimation} />}
    </ClientOnly>
  );
}
