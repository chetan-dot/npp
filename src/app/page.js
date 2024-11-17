"use client";
import Aboutnagarpalika from "@/components/Aboutnagarpalika";
import Events from "@/components/Events";
import ImageBioSection from "@/components/ImageBioSection";
import MarqueeTag from "@/components/MarqueeTag";
import PieChartContainer from "@/components/PieChart";
import QuickLinks from "@/components/QuickLinks";
import Sectionpeople from "@/components/Sectionpeople";
import SocialAccountsProfileFrames from "@/components/SocialAccountsProfileFrames";
import Swiper from "@/components/Swiper";

export default function Home() {

  return (
    <div className="  flex-col flex">
      <MarqueeTag  /> 
      <Swiper />
      <Aboutnagarpalika/>
      {/* <PieChartContainer/> */}
      <ImageBioSection />
      <Sectionpeople />
      <Events />
      <QuickLinks />
      <SocialAccountsProfileFrames />
    </div>
  );
}
