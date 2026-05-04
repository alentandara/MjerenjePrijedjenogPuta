import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { IME_APLIKACIJE } from "../constants";

export default function Home(){
    return (
        <>
        <h1>Dobrodošli na {IME_APLIKACIJE}</h1>
        
        <div style={{maxWidth: '500px', margin: 'auto'}}>
                <DotLottieReact
                    src="/avion.lottie"
                    loop
                    autoplay
                />
            </div>
        </>
    )
}