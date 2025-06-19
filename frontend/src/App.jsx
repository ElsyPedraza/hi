import { useAxios } from "./contexts/AxiosProvider";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import Header from "./components/Header";
import level0 from "./assets/level_0.png";
import level1 from "./assets/level_1.png";
import level2 from "./assets/level_2.png";
import level3 from "./assets/level_3.png";
import level4 from "./assets/level_4.png";
import toilets from "./assets/toilet.png";
//import Map from "./components/Map";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function App() {
  const axios = useAxios();

  const [array, setArray] = useState([]);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:3000");
    setArray(response.data.blogPosts);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="relative w-full h-screen">
        <img
          src={level0}
          alt="Mappa EnjoyPark"
          className="relative mx-auto object-cover h-[800px] z-0"
        />
        <img
          src={level1}
          alt="Mappa EnjoyPark"
          className="absolute -top-2 right-[482px] mx-auto object-cover h-[800px] z-0"
        />
        <img
          src={level2}
          alt="Mappa EnjoyPark"
          className="absolute -top-2 right-[488px] mx-auto object-cover h-[800px] z-0"
        />
        <img
          src={level3}
          alt="Mappa EnjoyPark"
          className="absolute -top-2 right-[488px] mx-auto object-cover h-[800px] z-0"
        />
        <img
          src={level4}
          alt="Mappa EnjoyPark"
          className="absolute -top-2 right-[488px] mx-auto object-cover h-[800px] z-0"
        />

        {/* <Map/> */}
        <div className="absolute top-[24%] left-[21%] w-16 h-16 z-10">
          <DotLottieReact
            className="w-[400px] h-[400px]"
            src="https://lottie.host/da2fe80e-4f42-49e7-bdbe-7020b151027a/a6hbrs7td3.lottie"
            loop
            autoplay
          />
        </div>
        <div className="absolute top-[23%] left-[44%] w-36 h-36 z-10">
          {" "}
          {/* carousel */}
          <DotLottieReact
            src="https://lottie.host/9e418f94-e96a-4d23-a2f7-034f55dc5261/VLMuJx8QYG.lottie"
            loop
            autoplay
          />
        </div>
        <div className="absolute top-[-16%] left-[35%] w-80 h-96 z-10">
          {" "}
          {/* montagna */}
          <DotLottieReact
            src="https://lottie.host/7461ec7f-3514-45e0-94de-56c24a507256/SIgncChnh5.lottie"
            loop
            autoplay
          />
        </div>
        <div className="absolute top-[68%] left-[43%] w-48 z-10">
          {" "}
          {/* festa */}
          <DotLottieReact
            src="https://lottie.host/2dde1a34-c4d3-4abc-8184-97111ad7f372/Mu9jjiqAP1.lottie"
            loop
            autoplay
          />
        </div>
        <div className="absolute top-[15%] left-[20%] w-48 z-10">
          {" "}
          {/* mongolfiera */}
          <DotLottieReact
            src="https://lottie.host/cf5d6e90-3824-48eb-91dc-44c7abd9ff4a/w4Ma4TXS2y.lottie"
            loop
            autoplay
          />
        </div>
        <div className="absolute top-[-5%] left-[20%] w-96 z-10">
          {" "}
          {/* cloud */}
          <DotLottieReact
            src="https://lottie.host/01f968eb-3cd3-4a7b-8242-dd1f137d0581/xW7yQeMk3H.lottie"
            loop
            autoplay
          />
        </div>
        <div className="absolute top-[2%] left-[60%] w-96 z-10">
          {" "}
          {/* cloud */}
          <DotLottieReact
            src="https://lottie.host/01f968eb-3cd3-4a7b-8242-dd1f137d0581/xW7yQeMk3H.lottie"
            loop
            autoplay
          />
        </div>
        <div className="absolute top-[48%] left-[59%] w-52 z-10">
          {" "}
          {/* food */}
          <DotLottieReact
            src="https://lottie.host/6ea551ee-009d-40ad-b9ec-5e7a0230ebcb/z4rgLjIqXe.lottie"
            loop
            autoplay
          />
        </div>
        <div className="absolute top-[30%] left-[34%] w-52 z-10">
          {" "}
          {/* medical Station */}
          <DotLottieReact
      src="https://lottie.host/21171f4c-a9cb-4a98-8502-abaf5701313f/4xo70eceQU.lottie"
      loop
      autoplay
    />
        </div>
        <div className="absolute top-[63%] left-[35%] w-48 z-10">
          {" "}
          {/* infopoint */}
          <DotLottieReact
      src="https://lottie.host/84f7bcf8-7ce4-41b5-9382-cf7becc0e15b/ln2QTevmq7.lottie"
      loop
      autoplay
    />
        </div>
        <div>
          <img
          src={toilets}
          alt="toilets"
          className="absolute top-[530px] right-[715px] mx-auto object-cover z-0"
        />
        </div>
      </div>
      <Button className="bg-red-800 text-white">Click Me</Button>
      <ul>
        {array.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
