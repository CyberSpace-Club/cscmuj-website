import React from "react";
import "@/app/globals.css";
import Person from "../components/Person";
import h1 from "@/assets/team/behindTheScene.svg";
import h2 from "@/assets/team/facultyCoordinator.svg";
import h21 from "@/assets/team/facultyCoordinatorStraight.svg";
import h3 from "@/assets/team/dsw.svg";
import h4 from "@/assets/team/executive.svg";
import h5 from "@/assets/team/core.svg";
import h6 from "@/assets/team/deputyCore.svg";

//Faculties
import UmaShankar from "@/assets/team/people/FacultyCoordinator/DrUmashankarRawat.jpg";
import Rohit from "@/assets/team/people/FacultyCoordinator/DrRohitBhatnagar.jpg";
import AmitKumarBairwa from "@/assets/team/people/FacultyCoordinator/AmitKumarBairwa.jpg";
import Sanchit from "@/assets/team/people/DSW/SanchitAnand.jpg";

//Execs
import abhinav from "@/assets/team/people/ecs/presi.jpeg";
import ambika from "@/assets/team/people/ecs/vicepresi.jpg";
import shiv from "@/assets/team/people/ecs/Shiv1.jpg";
import stuti from "@/assets/team/people/ecs/Stuti1.jpeg";
import harshit from "@/assets/team/people/ecs/harshit.jpg";
import suyash from "@/assets/team/people/ecs/Suyash1.jpg";
import amritansh from "@/assets/team/people/ecs/Amritansh.jpg";
import avichal from "@/assets/team/people/ecs/AvichalKhanna.png";
import soumyadeepa from "@/assets/team/people/ecs/Soumyadeepa1.jpg";

//Advisory
import rishabh from "@/assets/team/people/advisory/rishabh.jpg";
import kuber from "@/assets/team/people/advisory/kuber.jpg";
import ganesh from "@/assets/team/people/advisory/ganesh.jpg";
import arnab from "@/assets/team/people/advisory/arnab.png";
import pranavU from "@/assets/team/people/advisory/pranav.jpg";
import adityaA from "@/assets/team/people/advisory/aditya.png";
import anhad from "@/assets/team/people/advisory/anhad.jpg";

//Heads
import manas from "@/assets/team/people/heads/manas.jpg";
import anukriti from "@/assets/team/people/heads/anukriti.jpg";
import suyashsharma from "@/assets/team/people/heads/suyashsharma.jpg";
import sarthak from "@/assets/team/people/heads/sarthak.jpeg";
import manshi from "@/assets/team/people/heads/manshi.jpg";
import parishikha from "@/assets/team/people/heads/parishikha.jpeg";
import nikita from "@/assets/team/people/heads/nikita.jpeg";
import ananye from "@/assets/team/people/heads/ananye1.jpg";
import sidharth from "@/assets/team/people/heads/sidharth.jpg";
import vaibhav from "@/assets/team/people/heads/vaibhav.jpeg";

//Joint Heads
import vedant from "@/assets/team/people/joint/vedant.png";
import harshitdubey from "@/assets/team/people/joint/harshitdubey.jpg";
import snehal from "@/assets/team/people/joint/snehal.jpeg";
import vidhi from "@/assets/team/people/joint/vidhi.jpg";
import samyukta from "@/assets/team/people/joint/samyukta.jpg";
import neha from "@/assets/team/people/joint/neha.jpeg";
import ojash from "@/assets/team/people/joint/ojash.jpeg";
import pradyumn from "@/assets/team/people/joint/pradyumn.jpg";
import satyam from "@/assets/team/people/joint/satyam.jpeg";
import prisha from "@/assets/team/people/joint/prisha.jpg";
import prakhar from "@/assets/team/people/joint/prakhar.jpg";
import sanaya from "@/assets/team/people/joint/sanaya.jpg";
import daksh from "@/assets/team/people/joint/daksh.jpg";
import chetna from "@/assets/team/people/joint/chetna.jpg";
import nitigya from "@/assets/team/people/joint/nitigya.jpeg";
import nileshwari from "@/assets/team/people/joint/nileshwari.jpg";
import pranjal from "@/assets/team/people/joint/pranjal.jpg";
import ayush from "@/assets/team/people/joint/ayush.jpg";
import mayank from "@/assets/team/people/joint/mayank.jpg";

//SeniorCoordinators
import jyothi from "@/assets/team/people/seniorCoordinators/jyothi.jpg";
import yash from "@/assets/team/people/seniorCoordinators/yash.jpg";
import priyansh from "@/assets/team/people/seniorCoordinators/priyansh.jpg";
import pranav from "@/assets/team/people/seniorCoordinators/pranav.jpeg";
import jiya from "@/assets/team/people/seniorCoordinators/jiya.jpg";
import bhumi from "@/assets/team/people/seniorCoordinators/bhumi.jpg";
import aditya from "@/assets/team/people/seniorCoordinators/aditya.jpg";
import rudra from "@/assets/team/people/seniorCoordinators/rudra.jpeg";
import faisal from "@/assets/team/people/seniorCoordinators/faisal.jpg";
import shubhangi from "@/assets/team/people/seniorCoordinators/shubhangi.jpeg";
import riya from "@/assets/team/people/seniorCoordinators/riya.jpeg";
import shivaksh from "@/assets/team/people/seniorCoordinators/shivaksh.png";
import akshat from "@/assets/team/people/seniorCoordinators/akshat.jpg";
import priyanshu from "@/assets/team/people/seniorCoordinators/priyashu.jpeg";
import saumya from "@/assets/team/people/seniorCoordinators/saumya.png";
import sana from "@/assets/team/people/seniorCoordinators/sana.jpeg";
import shashank from "@/assets/team/people/seniorCoordinators/shashank.jpg";
import lav from "@/assets/team/people/seniorCoordinators/lav.jpg";

//Community Managers
import manish from "@/assets/team/people/commu_manager/Manish1.jpg";
import suhani from "@/assets/team/people/commu_manager/suhanirusia.jpg";

import Image from "next/image";

const TeamPage = () => {
  return (
    <div
      className="w-full min-h-screen pt-[100px] pb-20 text-[#eeeeee] overflow-x-hidden
      g:bg-slate-800 d:bg-slate-600 m:bg-slate-400"
    >
      {/* Universal Page Wrapper to eliminate awkward wide spacing while retaining balance */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 space-y-24">
        
        {/* Main Header */}
        <div className="flex justify-center w-full">
          <Image alt="our team" height={600} width={600} src={h1} className="hidden lg:block object-contain" />
          <Image height={500} width={500} src={h1} alt="Faculty Coordinators Header" className="hidden md:block lg:hidden object-contain" />
          <Image height={400} width={400} src={h1} alt="Faculty Coordinators Header" className="md:hidden block object-contain" />
        </div>

        {/* Fac coordinators */}
        <section className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-8 items-center justify-items-center">
            <div className="col-span-1 md:block hidden justify-self-start">
              <Image height={300} width={150} src={h2} alt="Faculty Coordinators Side" />
            </div>
            <div className="sm:col-span-2 md:hidden my-4">
              <Image height={150} width={350} src={h21} alt="Faculty Coordinators Mobile" />
            </div>
            <div className="md:col-span-2">
              <Person img={Rohit} name="Dr. Roheet Bhatnagar" post="Directorate of Research" link1="https://www.linkedin.com/in/dr-roheet-bhatnagar-79ba8015/" link2="https://jaipur.manipal.edu/foe/schools-faculty/faculty-list/roheet-bhatnagar.html" />
            </div>
            <div className="md:col-span-2">
              <Person img={UmaShankar} name="Dr. Umashankar Rawat" post="Professor in Department of CSE" link1="https://www.linkedin.com/in/umashankar-rawat-41730a48/" link2="https://jaipur.manipal.edu/foe/schools-faculty/faculty-list/uma-shankar-rawat.html" />
            </div>
            <div className="md:col-span-2">
              <Person img={AmitKumarBairwa} name="Dr. Amit Kumar Bairwa" post="Professor in Department of CSE" link1="https://www.linkedin.com/in/dr-amit-kumar-bairwa-460aaaa9/?originalSubdomain=in" link2="https://jaipur.manipal.edu/foe/schools-faculty/faculty-list/Amit-Kumar-Bairwa.html" />
            </div>
          </div>
          <div className="pageSeparator mt-12" />
        </section>

        {/* dsw */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-8 items-center">
            <div className="md:col-span-6 flex justify-center">
              <Person img={Sanchit} name="Dr. Sanchit Anand" post="Assistant Director, Directorate of Student's Welfare" link1="https://www.linkedin.com/in/dr-sanchit-anand-4a9112105/" link2="https://jaipur.manipal.edu/muj/academics/institution-list/foe/schools-faculty/faculty-list/Sanchit-Anand.html" />
            </div>
            <div className="col-span-1 hidden md:flex justify-end">
              <Image height={200} width={100} src={h3} alt="DSW Side" />
            </div>
          </div>
          <div className="pageSeparator mt-12" />
        </section>

        {/* Exec */}
        <section className="flex flex-col items-center w-full">
          <Image height={300} width={600} src={h4} alt="Executive Team Header" className="pb-8 hidden lg:block" />
          <Image height={260} width={500} src={h4} alt="Executive Team Header" className="pb-8 hidden md:block lg:hidden" />
          <Image height={200} width={340} src={h4} alt="Executive Team Header" className="pb-6 md:hidden block" />
          <div className="gap-y-10 gap-x-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={abhinav} name="Abhinav Trikha" post="Chairperson" link1="https://www.linkedin.com/in/abhinav-trikha/" link2="https://www.instagram.com/abhinav_trikha/" />
            <Person img={ambika} name="Ambika Seth" post="Vice-Chairperson" link1="https://www.linkedin.com/in/ambika-seth-084149333/" link2="https://www.instagram.com/_.ambikaseth._/" />
            <Person img={shiv} name="Shiv Pratap Suryavanshi" post="General Secretary" link1="https://www.linkedin.com/in/shiv-pratap-suryavanshi-28b387196/" link2="https://www.instagram.com/_ik.shiv/" />
            <Person img={stuti} name="Stuti Agrawal" post="Treasurer" link1="https://www.linkedin.com/in/stuti-agrawal-a71062333/" link2="https://www.instagram.com/stuti4835/" />
            <Person img={harshit} name="Harshit Raj Singh" post="Technical Secretary" link1="https://www.linkedin.com/in/harshit-raj-singh-613953335/" link2="https://www.instagram.com/_.harshit._.17/" />
            <Person img={suyash} name="Suyash Pandey" post="Managing Director" link1="https://www.linkedin.com/in/suyash-pandey-a4b8b4326/" link2="https://www.instagram.com/__suyash_08/" />
            <Person img={amritansh} name="Amritansh Srivastava" post="Creative Director" link1="https://www.linkedin.com/in/amritansh-srivastava-199b3b230/" link2="https://www.instagram.com/amritanshsriv/" />
            <Person img={avichal} name="Avichal Khanna" post="Joint Secretary" link1="https://www.linkedin.com/in/avichal-khanna-92b5b1278/" link2="https://www.instagram.com/_avichalkhanna_/" />
            <Person img={soumyadeepa} name="Soumyadeepa Pal" post="Art Director" link1="https://www.linkedin.com/in/soumyadeepa-pal/" link2="https://www.instagram.com/_soumyadeepa_pal_" />
          </div>
          <div className="pageSeparator w-full mt-16" />
        </section>

        {/* Advisory Section */}
        <section className="flex flex-col items-center w-full">
          <h1 className="heads text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-10 text-center tracking-tight">ADVISORY BOARD</h1>
          <div className="gap-y-10 gap-x-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={rishabh} name="Rishabh Pandey" link1="https://www.linkedin.com/in/rishabh-r-pandey-848615218/" link2="https://www.instagram.com/mr.rishabh_978/" />
            <Person img={kuber} name="Kuber Chhabra" link1="https://www.linkedin.com/in/kuber-chhabra-616101295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" link2="https://www.instagram.com/kuber.chhabra/" />
            <Person img={ganesh} name="Ganesh Kotwade" link1="https://www.linkedin.com/in/ganesh-kotwade-2a2191275?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" link2="https://www.instagram.com/gannnyk?igsh=ZWhtMTlxODJoZmsz" />
            <Person img={arnab} name="Arnab Roy" link1="https://www.linkedin.com/in/arnab-roy-913548313/" link2="https://www.instagram.com/arnab_1411/?hl=en" />
            <Person img={pranavU} name="Pranav Upadhyay" link1="https://www.linkedin.com/in/pranav-upadhyay-6a526a311?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" link2="https://www.instagram.com/_lifewithpranav_?igsh=MWE3anhpeHJrZmxqaw==" />
            <Person img={adityaA} name="Aditya Agrawal" link1="https://www.linkedin.com/in/aditya-agrawal-ab5979288?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" link2="https://www.instagram.com/adityaa_agrawalll?igsh=MXI4eHY0ZmdrejRwaA%3D%3D&utm_source=qr" />
            <Person img={anhad} name="Anhadbani Anand" link1="https://www.linkedin.com/in/anhadbani-anand-2bab4a305?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" link2="https://www.instagram.com/anhad265?igsh=MThxc2Y2Y3ExMW13ZA==" />
          </div>
          <div className="pageSeparator w-full mt-16" />
        </section>

        {/* Community Manager */}
        <section className="flex flex-col items-center w-full">
          <h1 className="heads text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-10 text-center tracking-tight">COMMUNITY MANAGERS</h1>
          <div className="gap-y-10 gap-x-8 grid grid-cols-1 sm:grid-cols-2 justify-items-center w-full max-w-4xl">
            <Person img={manish} name="Manish Kumar Pandey" post="" link1="https://www.linkedin.com/in/manish-kumar-pandey-a0ba98378?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" link2="https://www.instagram.com/itz.me_manish.7?igsh=dzEzanMyaHV1bWhx" />
            <Person img={suhani} name="Suhani Rusia" post="" link1="https://www.linkedin.com/in/suhani-rusia-806734371/" link2="https://www.instagram.com/suhanniiiii07?igsh=N3R2dGppbjk4YTNz" />
          </div>
          <div className="pageSeparator w-full mt-16" />
        </section>

        {/* Core / Heads */}
        <section className="flex flex-col items-center w-full">
          <h1 className="heads text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-10 text-center tracking-tight">HEADS</h1>
          <div className="gap-y-10 gap-x-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={manas} name="Manas Malhotra" post="Head of Events" link1="https://www.linkedin.com/in/manas-malhotra-351245378?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/manasmalhotra3?igsh=dDN2dXU2cXcwb2ky" />
            <Person img={anukriti} name="Anukriti Katoch" post="Head of Programs" link1="https://www.linkedin.com/in/anukriti-katoch-946472269?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" link2="https://www.instagram.com/palakshi_71?igsh=bWoxOGEybGFoMmts" />
            <Person img={parishikha} name="Parisikha Jain" post="Head of Marketing" link1="https://www.linkedin.com/in/parisikha-jain-b46504413?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/parisikha_20?igsh=dTU3Mmd0azd5czl6" />
            <Person img={manshi} name="Manshi Singh" post="Technical Head" link1="https://www.linkedin.com/in/manshi-singh-370618404?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/" />
            <Person img={sarthak} name="Sarthak Agrawal" post="Head of Research & Development" link1="https://www.linkedin.com/in/sarthak-agrawal-83074437b/" link2="https://www.instagram.com/sarthak_leo2/" />
            <Person img={vaibhav} name="Vaibhav Birhman" post="Head of Curations" link1="http://www.linkedin.com/in/chaudharyvaibhavbirhman" link2="https://www.instagram.com/weesheshh/" />
            <Person img={sidharth} name="Siddharth Singh" post="Head of Corporate Affairs" link1="https://www.linkedin.com/in/siddharth-singh-1b9693378?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/" />
            <Person img={suyashsharma} name="Suyash Sharma" post="Head of Media" link1="http://www.linkedin.com/in/suyash312" link2="https://www.instagram.com/suyash_3211/" />
            <Person img={nikita} name="Nikita Tyagi" post="Head of Creatives" link1="https://www.linkedin.com/in/nikita-tyagi-a99927261?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/notthatnikita?utm_source=qr&igsh=MTlncWM5czdocTNpdQ==" />
            <Person img={ananye} name="Ananye Verma" post="Head of Operations & Logistics" link1="https://www.linkedin.com/in/ananye-verma-0b634237b?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/ananyeverma_142?igsh=MXNleDZ0NGJueXVvdg==" />
          </div>
          <div className="pageSeparator w-full mt-16" />
        </section>

        {/* Joint Heads */}
        <section className="flex flex-col items-center w-full">
          <h1 className="heads text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-10 text-center tracking-tight">JOINT HEADS</h1>
          <div className="gap-y-10 gap-x-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={vedant} name="Vedant Bariar" post="Joint Head of Events" link1="https://www.linkedin.com/in/vedant-bariar-138a31364?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/vedaxntt/" />
            <Person img={harshitdubey} name="Harshit Dubey" post="Joint Head of Programs" link1="https://www.linkedin.com/in/harshit-dubey-03073339b/" link2="https://www.instagram.com/hars4t?igsh=MTBpOHkxMnBwc2tsdA==" />
            <Person img={snehal} name="Snehal Singh" post="Joint Head of Programs" link1="https://www.linkedin.com/in/snehal-singh-b46782378?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/tanusingh_0205/" />
            <Person img={vidhi} name="Vidhi Dalmia" post="Joint Head of Marketing" link1="http://www.linkedin.com/in/vidhi-dalmia06" link2="https://www.instagram.com/vidhiiii_dalmia?igsh=MTc5cGt0b2M3aHkwdw==" />
            <Person img={samyukta} name="Samyukta Basu" post="Joint Head of Marketing" link1="https://www.linkedin.com/in/samyukta-basu-79656329a?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/_samyukta__?igsh=bTVvOW84d3d5cXIz" />
            <Person img={neha} name="Neha Jakhar" post="Joint Head of Marketing" link1="https://www.linkedin.com/in/neha-jakhar-690739372?utm_source=share_via&utm_content=profile&utm_medium=member_ios" link2="https://www.instagram.com/_neha4a?igsh=MXZsNW9ibHJxaThq&utm_source=qr" />
            <Person img={ojash} name="Ojash Bhatnagar" post="Joint Head of Technical" link1="https://www.linkedin.com/in/ojash-bhatnagar-35b37a380/" link2="https://www.instagram.com/its_ojash08/" />
            <Person img={pradyumn} name="Pradyumn Kabra" post="Joint Head of Technical" link1="https://www.linkedin.com/in/pradyumn-kabra-b17386233/" link2="https://www.instagram.com/pradyumn.__k" />
            <Person img={satyam} name="Satyam Jha" post="Joint Head of Research & Development" link1="https://www.linkedin.com/in/satyam-jha-26b310301/" link2="https://www.instagram.com/" />
            <Person img={prisha} name="Prisha Mishra" post="Joint Head of Curations" link1="https://www.linkedin.com/in/prisha-mishra-40397237b?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/pri.sha0205?igsh=Zjd6NDMzamJ6ZW9z" />
            <Person img={prakhar} name="Prakhar Yadav" post="Joint Head of Corporate Affairs" link1="https://www.linkedin.com/in/prakhar-yadav-5200b1376?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/imyadavprakhar?igsh=eDE1OTd3N285NW15" />
            <Person img={sanaya} name="Sanaya Muchhal" post="Joint Head of Corporate Affairs" link1="https://www.linkedin.com/in/sanayamuchhal?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/_.sanaya._07" />
            <Person img={daksh} name="Daksh Narwaria" post="Joint Head of Corporate Affairs" link1="https://www.linkedin.com/in/rugved-gujar-a36061310/" link2="https://www.instagram.com/dakxh.69" />
            <Person img={chetna} name="Chetna Sharma" post="Joint Head of Graphic Design" link1="https://www.linkedin.com/in/chetna-sharma-13b1122ab?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/miiss__so_yeon?igsh=MW93MnpyZWJpaGdrbg==" />
            <Person img={nitigya} name="Nitigya Surana" post="Joint Head of Graphic Design" link1="https://www.linkedin.com/in/nitigya-surana-5b75a3379/" link2="https://www.instagram.com/nitigya_0607/" />
            <Person img={nileshwari} name="Nileshwari Patil" post="Joint Head of Media" link1="https://www.linkedin.com/in/nileshwari-patil-3b6380253?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/nileshwaripatil9_?igsh=MTl4b3ZhaWVuYWVpMw==" />
            <Person img={pranjal} name="Pranjal Patel" post="Joint Head of Media" link1="http://www.linkedin.com/in/pranjal-patel-53b272375" link2="https://www.instagram.com/pranjalpatel._?igsh=MTlxZGRlYWo4dWFheQ%3D%3D&utm_source=qr" />
            <Person img={ayush} name="Ayush Gupta" post="Joint Head of Operations & Logistics" link1="https://www.linkedin.com/in/ayush-gupta-88a4b3373" link2="https://www.instagram.com/_ayush_g__03/" />
            <Person img={mayank} name="Mayank Pramanick" post="Joint Head of Operations & Logistics" link1="https://www.linkedin.com/" link2="https://www.instagram.com/" />
          </div>
          <div className="pageSeparator w-full mt-16" />
        </section>

        {/* Senior Coordinator */}
        <section className="flex flex-col items-center w-full">
          <h1 className="heads text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-10 text-center tracking-tight">SENIOR CO-ORDINATORS</h1>
          <div className="gap-y-10 gap-x-8 grid grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={jyothi} name="Jyothi Anand" post="Senior Coordinator Events" link1="https://www.linkedin.com/in/jyothi-a-6884163b9?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/" />
            <Person img={yash} name="Yash Yadav" post="Senior Coordinator Events" link1="https://www.linkedin.com/in/yash-yadav-28566b3a9?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/yashyadav_6?igsh=bGhoeWdtZ3NpMA==" />
            <Person img={priyansh} name="Priyansh Agarwal" post="Senior Coordinator Programs" link1="https://www.linkedin.com/in/priyansh-agarwal-512999365?utm_source=share_via&utm_content=profile&utm_medium=member_ios" link2="https://www.instagram.com/priyansh._.03?igsh=MTA2c3Y2c2V0aG10cw%3D%3D&utm_source=qr" />
            <Person img={pranav} name="Pranav Avadhanula" post="Senior Coordinator Programs" link1="https://www.linkedin.com/in/pranav-avadhanula-b19425280" link2="https://www.instagram.com/pranav_avadhanula?igsh=NzF6anB1OTRxcTQx" />
            <Person img={jiya} name="Jiya Chhabra" post="Senior Coordinator Marketing" link1="http://www.linkedin.com/in/jiya-chhabra-080776304" link2="https://www.instagram.com/jiya.chh_21" />
            <Person img={bhumi} name="Bhumi Shrivastav " post="Senior Coordinator Marketing" link1="https://www.linkedin.com/in/bhumi-shrivastav?utm_source=share_via&utm_content=profile&utm_medium=member_ios" link2="https://www.instagram.com/bhumi._shrivastav?igsh=MXBnNGU0ZDI5eTQ1Mg%3D%3D&utm_source=qr" />
            <Person img={aditya} name="Aditya Tripathi" post="Senior Coordinator Technical" link1="https://www.linkedin.com/in/aditya-tripathi-922a2429a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" link2="https://www.instagram.com/aditya._tripathi._?utm_source=qr" />
            <Person img={rudra} name="Rudra Pratap Singh" post="Senior Coordinator Technical" link1="https://www.linkedin.com/in/rudra-pratap-singh-8523502b6" link2="https://www.instagram.com/rudrapratapsingh.725" />
            <Person img={faisal} name="Mohammad Faisal" post="Senior Coordinator Technical" link1="https://www.linkedin.com/in/mohammed-faisal-833a81375" link2="https://www.instagram.com/treats_with_faisal" />
            <Person img={shubhangi} name="Shubhangi Kesharwani" post="Senior Coordinator Research & Development" link1="https://www.linkedin.com/in/shubhangi-kesharwani-363189383/" link2="https://www.instagram.com/shubhangikesharwani21?igsh=Z2htODFlb284bDlh" />
            <Person img={riya} name="Riya Kumari" post="Senior Coordinator Research & Development" link1="https://www.linkedin.com/in/riya-kumari-5b302239a/" link2="https://www.instagram.com" />
            <Person img={shivaksh} name="Shivaksh Tandon" post="Senior Coordinator Research & Development" link1="https://www.linkedin.com/in/shivakshtandon?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/shivakshtandon" />
            <Person img={akshat} name="Akshat Malik " post="Senior Coordinator Curations" link1="https://www.linkedin.com/in/akshat-malik-938229397?utm_source=share_via&utm_content=profile&utm_medium=member_android" link2="https://www.instagram.com/_whois_akshat" />
            <Person img={priyanshu} name="Priyanshu Bagra" post="Senior Coordinator Media" link1="https://www.linkedin.com" link2="https://www.instagram.com/Priyanshuuuuuuuuuuuuuuuuu" />
            <Person img={saumya} name="Saumya Singh" post="Senior Coordinator Media" link1="https://www.linkedin.com/in/saumya-singh-799358381?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" link2="https://www.instagram.com" />
            <Person img={sana} name="Sana Firdous" post="Senior Coordinator Media" link1="https://www.linkedin.com/" link2="https://www.instagram.com/Sunn.aaaaa" />
            <Person img={shashank} name="Shashank Singh" post="Senior Coordinator Operations & Logistics" link1="https://www.linkedin.com/" link2="https://www.instagram.com/og_shashank.30" />
            <Person img={lav} name="Lav Goyal" post="Senior Coordinator Operations & Logistics" link1="https://www.linkedin.com/in/lav-goyal-5a7215416" link2="https://www.instagram.com/lavv.goyal" />
          </div>
        </section>

      </div>
    </div>
  );
};

export default TeamPage;