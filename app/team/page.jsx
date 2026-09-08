import React from "react";
import "@/app/globals.css";
import Person from "../components/Person";
import h1 from "@/assets/team/behindTheScene.svg";
import h2 from "@/assets/team/facultyCoordinator.svg";
import h21 from "@/assets/team/facultyCoordinatorStraight.svg";
import h3 from "@/assets/team/dsw.svg";
import h4 from "@/assets/team/executive.svg";

// Faculties
import UmaShankar from "@/assets/team/people/FacultyCoordinator/DrUmashankarRawat.jpg";
import adityasinha from "@/assets/team/people/ecs/adityasinha.png";
import kavita from "@/assets/team/people/ecs/kavita.png";
import bagesh from "@/assets/team/people/ecs/bagesh.png";
import pankaj from "@/assets/team/people/DSW/pankaj.png";
import Sanchit from "@/assets/team/people/DSW/SanchitAnand.jpg";
import dean from "@/assets/team/people/DSW/dean.png";

// Execs
import abhinav from "@/assets/team/people/ecs/presi.jpeg";
import ambika from "@/assets/team/people/ecs/vicepresi.jpg";
import stuti from "@/assets/team/people/ecs/Stuti1.jpeg";
import harshit from "@/assets/team/people/ecs/harshit.jpg";
import suyash from "@/assets/team/people/ecs/Suyash1.jpg";
import amritansh from "@/assets/team/people/ecs/amritansh.png";
import arindam1 from "@/assets/team/people/ecs/arindam1.png";
import soumyadeepa from "@/assets/team/people/ecs/Soumyadeepa1.jpg";

// Advisory
import rishabh from "@/assets/team/people/advisory/rishabh.jpg";
import kuber from "@/assets/team/people/advisory/kuber.jpg";
import arnab from "@/assets/team/people/advisory/arnab.png";
import pranavU from "@/assets/team/people/advisory/pranav.jpg";
import adityaA from "@/assets/team/people/advisory/aditya.png";
import anhad from "@/assets/team/people/advisory/anhad.jpg";

// Heads
import manas from "@/assets/team/people/heads/manas.jpg";
import anukriti from "@/assets/team/people/heads/anukriti.jpg";
import suyashsharma from "@/assets/team/people/heads/suyashsharma.jpg";
import sarthak from "@/assets/team/people/heads/sarthak.jpeg";
import manshi from "@/assets/team/people/heads/manshi.jpg";
import parishikha from "@/assets/team/people/heads/parishikha.jpeg";
import ananye from "@/assets/team/people/heads/ananye1.jpg";
import sidharth from "@/assets/team/people/heads/sidharth.jpg";

// Joint Heads
import harshitdubey from "@/assets/team/people/joint/dubey.png";
import snehal from "@/assets/team/people/joint/snehal.jpeg";
import samyukta from "@/assets/team/people/joint/samyukta.jpg";
import ojash from "@/assets/team/people/joint/ojash.jpeg";
import pradyumn from "@/assets/team/people/joint/pradyumn.jpg";
import prakhar from "@/assets/team/people/joint/prakhar.jpg";
import sanaya from "@/assets/team/people/joint/sanaya.jpg";
import chetna from "@/assets/team/people/joint/chetna.jpg";
import nitigya from "@/assets/team/people/joint/nitigya.jpeg";
import nileshwari from "@/assets/team/people/joint/nileshwari.jpg";
import pranjal from "@/assets/team/people/joint/pranjal.jpg";

// SeniorCoordinators
import jyothi from "@/assets/team/people/seniorCoordinators/jyothi.jpg";
import yash from "@/assets/team/people/seniorCoordinators/yash.jpg";
import priyansh from "@/assets/team/people/seniorCoordinators/priyansh.jpg";
import jiya from "@/assets/team/people/seniorCoordinators/jiya.jpg";
import aditya from "@/assets/team/people/seniorCoordinators/aditya.jpg";
import rudra from "@/assets/team/people/seniorCoordinators/rudra.jpeg";
import faisal from "@/assets/team/people/seniorCoordinators/faisal.jpg";
import shubhangi from "@/assets/team/people/seniorCoordinators/shubhangi.jpeg";
import riya from "@/assets/team/people/seniorCoordinators/riya.jpeg";
import saumya from "@/assets/team/people/seniorCoordinators/saumya.png";
import shashank from "@/assets/team/people/seniorCoordinators/shashank.jpg";
import lav from "@/assets/team/people/seniorCoordinators/lav.jpg";
import satyam from "@/assets/team/people/joint/satyam.jpeg";
import mayank from "@/assets/team/people/joint/mayank.jpg";

// Community Managers
import manish from "@/assets/team/people/commu_manager/Manish1.jpg";
import suhani from "@/assets/team/people/commu_manager/suhanirusia.jpg";

import Image from "next/image";

const TeamPage = () => {
  return (
    <div className="relative w-full pt-[120px] pb-20 text-[#eeeeee] overflow-x-hidden bg-[#0a0a0a] selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* Background Decorative Lighting (Orange/Black Ambient Glows) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-orange-500/15 via-amber-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] left-[-250px] w-[650px] h-[650px] bg-orange-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[65%] right-[-250px] w-[650px] h-[650px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-24 justify-center items-center max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Main Header */}
        <div className="flex justify-center items-center w-full my-4 relative">
          <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full scale-75 pointer-events-none" />
          <Image alt="our team" height={600} width={600} src={h1} className="hidden lg:block filter drop-shadow-[0_10px_25px_rgba(249,115,22,0.15)] transition-transform duration-500 hover:scale-[1.02]" />
          <Image height={500} width={500} src={h1} alt="Faculty Coordinators Header" className="hidden md:block lg:hidden filter drop-shadow-[0_10px_25px_rgba(249,115,22,0.15)]" />
          <Image height={400} width={400} src={h1} alt="Faculty Coordinators Header" className="md:hidden block filter drop-shadow-[0_10px_25px_rgba(249,115,22,0.15)]" />
        </div>

        {/* Faculty Coordinators Section */}
        <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 w-full p-6 md:p-8 rounded-3xl bg-neutral-900/60 border border-orange-500/20 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col items-center md:hidden mb-4">
            <Image height={150} width={350} src={h21} alt="Faculty Coordinators Header" />
          </div>

          <div className="hidden md:flex justify-center items-center shrink-0 border-r border-orange-500/20 pr-6">
            <Image height={300} width={120} src={h2} alt="Faculty Coordinators Header" className="filter drop-shadow-[0_4px_12px_rgba(249,115,22,0.2)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full justify-items-center">
            <Person
              img={UmaShankar}
              name="Dr. Umashankar Rawat"
              post="Professor in Department of CSE"
              link1="https://www.linkedin.com/in/umashankar-rawat-41730a48/"
              link2="https://jaipur.manipal.edu/foe/schools-faculty/faculty-list/uma-shankar-rawat.html"
            />
            <Person
              img={adityasinha}
              name="Dr. Aditya Sinha"
              post="Assistant Professor in Department of CSE"
              link1="https://www.linkedin.com/in/aditya-sinha-ph-d-13261416/"
              link2="https://jaipur.manipal.edu/foe/schools-faculty/faculty-list/aditya-sinha.html"
            />
            <Person
              img={kavita}
              name="Dr. Kavita Jhajharia"
              post="Assistant Professor in Department of IT"
              link1="https://www.linkedin.com/in/dr-kavita-jhajharia-85b703124/"
              link2="https://jaipur.manipal.edu/foe/schools-faculty/faculty-list/Amit-Kumar-Bairwa.html"
            />
            <Person
              img={bagesh}
              name="Dr. Bagesh Kumar"
              post="Assistant Professor in Department of IT"
              link1="https://www.linkedin.com/in/dr-kavita-jhajharia-85b703124/"
              link2="https://jaipur.manipal.edu/foe/schools-faculty/faculty-list/Amit-Kumar-Bairwa.html"
            />
          </div>
        </div>

        {/* DSW Section */}
        <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 w-full p-6 md:p-8 rounded-3xl bg-neutral-900/60 border border-orange-500/20 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col items-center md:hidden mb-4">
            <Image height={150} width={350} src={h3} alt="DSW Header" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full justify-items-center">
            <Person
              img={dean}
              name="Dr. Madhura Yadav"
              post="Dean, Directorate of Student's Welfare"
              link1="https://www.linkedin.com/in/dr-madhura-yadav-0b261118/"
              link2="https://jaipur.manipal.edu/foe/schools-faculty/faculty-list/madhura-yadav.html"
            />
            <Person
              img={pankaj}
              name="Dr. Pankaj Vyas"
              post="Director, Directorate of Student's Welfare"
              link1="https://www.linkedin.com/in/dr-pankaj-vyas-8092281a/"
              link2="https://jaipur.manipal.edu/foe/schools-faculty/faculty-list/pankaj-vyas.html"
            />
            <Person
              img={Sanchit}
              name="Dr. Sanchit Anand"
              post="Assistant Director, Directorate of Student's Welfare"
              link1="https://www.linkedin.com/in/dr-sanchit-anand-4a9112105/"
              link2="https://jaipur.manipal.edu/muj/academics/institution-list/foe/schools-faculty/faculty-list/Sanchit-Anand.html"
            />
          </div>

          <div className="hidden md:flex justify-center items-center shrink-0 border-l border-orange-500/20 pl-6">
            <Image height={300} width={120} src={h3} alt="DSW Header" className="filter drop-shadow-[0_4px_12px_rgba(249,115,22,0.2)]" />
          </div>
        </div>

        {/* Executive Board Section */}
        <div className="relative flex flex-col justify-center items-center w-full my-4 p-8 md:p-12 rounded-3xl bg-gradient-to-b from-orange-500/10 via-neutral-900/80 to-black border border-orange-500/40 backdrop-blur-xl shadow-[0_0_50px_rgba(249,115,22,0.1)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
          
          <Image height={300} width={600} src={h4} alt="Executive Board Header" className="hidden lg:block mb-10 filter drop-shadow-[0_8px_20px_rgba(249,115,22,0.25)]" />
          <Image height={260} width={500} src={h4} alt="Executive Board Header" className="hidden md:block lg:hidden mb-10 filter drop-shadow-[0_8px_20px_rgba(249,115,22,0.25)]" />
          <Image height={200} width={340} src={h4} alt="Executive Board Header" className="md:hidden block mb-10 filter drop-shadow-[0_8px_20px_rgba(249,115,22,0.25)]" />

          {/* Chairperson & Vice-Chairperson Spotlight */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mb-12 w-full">
            <div className="transform transition-transform duration-300 hover:scale-105">
              <Person img={abhinav} name="Abhinav Trikha" post="Chairperson" link1="https://www.linkedin.com/in/abhinav-trikha/" link2="https://www.instagram.com/abhinav_trikha/" />
            </div>
            <div className="transform transition-transform duration-300 hover:scale-105">
              <Person img={ambika} name="Ambika Seth" post="Vice-Chairperson" link1="https://www.linkedin.com/in/ambika-seth-084149333/" link2="https://www.instagram.com/_.ambikaseth._/" />
            </div>
          </div>

          {/* Core Executives Grid */}
          <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={amritansh} name="Amritansh Srivastava" post="General Secretary" link1="https://www.linkedin.com/in/amritansh-srivastava-199b3b230/" link2="https://www.instagram.com/amritanshsriv/" />
            <Person img={stuti} name="Stuti Agrawal" post="Treasurer" link1="https://www.linkedin.com/in/stuti-agrawal-a71062333/" link2="https://www.instagram.com/stuti4835/" />
            <Person img={harshit} name="Harshit Raj Singh" post="Executive Secretary" link1="https://www.linkedin.com/in/harshit-raj-singh-613953335/" link2="https://www.instagram.com/_.harshit._.17/" />
            <Person img={suyash} name="Suyash Pandey" post="Managing Director" link1="https://www.linkedin.com/in/suyash-pandey-a4b8b4326/" link2="https://www.instagram.com/__suyash_08/" />
            <Person img={arindam1} name="Arindam Sharma" post="Operational Director" link1="https://www.linkedin.com/in/amritansh-srivastava-199b3b230/" link2="https://www.instagram.com/amritanshsriv/" />
            <Person img={soumyadeepa} name="Soumyadeepa Pal" post="Art Director" link1="https://www.linkedin.com/in/soumyadeepa-pal/" link2="https://www.instagram.com/_soumyadeepa_pal_" />
          </div>
        </div>

        {/* Advisory Board Section */}
        <div className="flex flex-col justify-center items-center w-full my-2">
          <div className="relative mb-8">
            <h1 className="heads text-4xl sm:text-5xl md:text-6xl text-center tracking-tight font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(249,115,22,0.2)]">
              ADVISORY BOARD
            </h1>
            <div className="h-[2px] w-28 mx-auto mt-2 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
          </div>
          <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={rishabh} name="Rishabh Pandey" link1="https://www.linkedin.com/in/rishabh-r-pandey-848615218/" link2="https://www.instagram.com/mr.rishabh_978/" />
            <Person img={arnab} name="Arnab Roy" link1="https://www.linkedin.com/in/arnab-roy-913548313/" link2="https://www.instagram.com/arnab_1411/?hl=en" />
            <Person img={kuber} name="Kuber Chhabra" link1="https://www.linkedin.com/in/kuber-chhabra-616101295" link2="https://www.instagram.com/kuber.chhabra/" />
            <Person img={pranavU} name="Pranav Upadhyay" link1="https://www.linkedin.com/in/pranav-upadhyay-6a526a311" link2="https://www.instagram.com/_lifewithpranav_" />
            <Person img={adityaA} name="Aditya Agrawal" link1="https://www.linkedin.com/in/aditya-agrawal-ab5979288" link2="https://www.instagram.com/adityaa_agrawalll" />
            <Person img={anhad} name="Anhadbani Anand" link1="https://www.linkedin.com/in/anhadbani-anand-2bab4a305" link2="https://www.instagram.com/anhad265" />
          </div>
        </div>

        {/* Community Managers Section */}
        <div className="flex flex-col justify-center items-center w-full my-2">
          <div className="relative mb-8">
            <h1 className="heads text-4xl sm:text-5xl md:text-6xl text-center tracking-tight font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(249,115,22,0.2)]">
              COMMUNITY MANAGERS
            </h1>
            <div className="h-[2px] w-28 mx-auto mt-2 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
          </div>
          <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 justify-items-center w-full max-w-2xl">
            <Person img={manish} name="Manish Kumar Pandey" post="" link1="https://www.linkedin.com/in/manish-kumar-pandey-a0ba98378" link2="https://www.instagram.com/itz.me_manish.7" />
            <Person img={suhani} name="Suhani Rusia" post="" link1="https://www.linkedin.com/in/suhani-rusia-806734371/" link2="https://www.instagram.com/suhanniiiii07" />
          </div>
        </div>

        {/* Heads Section */}
        <div className="flex flex-col justify-center items-center w-full my-2">
          <div className="relative mb-8">
            <h1 className="heads text-4xl sm:text-5xl md:text-6xl text-center tracking-tight font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(249,115,22,0.2)]">
              HEADS
            </h1>
            <div className="h-[2px] w-28 mx-auto mt-2 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
          </div>
          <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={manas} name="Manas Malhotra" post="Head of Events" link1="https://www.linkedin.com/in/manas-malhotra-351245378" link2="https://www.instagram.com/manasmalhotra3" />
            <Person img={anukriti} name="Anukriti Katoch" post="Head of Programs" link1="https://www.linkedin.com/in/anukriti-katoch-946472269" link2="https://www.instagram.com/palakshi_71" />
            <Person img={parishikha} name="Parisikha Jain" post="Head of Marketing" link1="https://www.linkedin.com/in/parisikha-jain-b46504413" link2="https://www.instagram.com/parisikha_20" />
            <Person img={manshi} name="Manshi Singh" post="Technical Head" link1="https://www.linkedin.com/in/manshi-singh-370618404" link2="https://www.instagram.com/" />
            <Person img={sarthak} name="Sarthak Agrawal" post="Head of Research & Development" link1="https://www.linkedin.com/in/sarthak-agrawal-83074437b/" link2="https://www.instagram.com/sarthak_leo2/" />
            <Person img={sidharth} name="Siddharth Singh" post="Head of Corporate Affairs" link1="https://www.linkedin.com/in/siddharth-singh-1b9693378" link2="https://www.instagram.com/" />
            <Person img={suyashsharma} name="Suyash Sharma" post="Head of Media" link1="http://www.linkedin.com/in/suyash312" link2="https://www.instagram.com/suyash_3211/" />
            <Person img={prakhar} name="Prakhar Yadav" post="Head of Curations" link1="https://www.linkedin.com/in/prakhar-yadav-5200b1376" link2="https://www.instagram.com/imyadavprakhar" />
            <Person img={ananye} name="Ananye Verma" post="Head of Operations & Logistics" link1="https://www.linkedin.com/in/ananye-verma-0b634237b" link2="https://www.instagram.com/ananyeverma_142" />
          </div>
        </div>

        {/* Joint Heads Section */}
        <div className="flex flex-col justify-center items-center w-full my-2">
          <div className="relative mb-8">
            <h1 className="heads text-4xl sm:text-5xl md:text-6xl text-center tracking-tight font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(249,115,22,0.2)]">
              JOINT HEADS
            </h1>
            <div className="h-[2px] w-28 mx-auto mt-2 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
          </div>
          <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={jyothi} name="Jyothi Anand" post="Joint Head of Events" link1="https://www.linkedin.com/in/jyothi-a-6884163b9" link2="https://www.instagram.com/" />
            <Person img={yash} name="Yash Yadav" post="Joint Head of Events" link1="https://www.linkedin.com/in/yash-yadav-28566b3a9" link2="https://www.instagram.com/yashyadav_6" />
            <Person img={priyansh} name="Priyansh Agarwal" post="Joint Head of Programs" link1="https://www.linkedin.com/in/priyansh-agarwal-512999365" link2="https://www.instagram.com/priyansh._.03" />
            <Person img={harshitdubey} name="Harshit Dubey" post="Joint Head of Programs" link1="https://www.linkedin.com/in/harshit-dubey-03073339b/" link2="https://www.instagram.com/hars4t" />
            <Person img={snehal} name="Snehal Singh" post="Joint Head of Programs" link1="https://www.linkedin.com/in/snehal-singh-b46782378" link2="https://www.instagram.com/tanusingh_0205/" />
            <Person img={samyukta} name="Samyukta Basu" post="Joint Head of Marketing" link1="https://www.linkedin.com/in/samyukta-basu-79656329a" link2="https://www.instagram.com/_samyukta__" />
            <Person img={rudra} name="Rudra Pratap Singh" post="Joint Head of Technical" link1="https://www.linkedin.com/in/rudra-pratap-singh-8523502b6" link2="https://www.instagram.com/rudrapratapsingh.725" />
            <Person img={ojash} name="Ojash Bhatnagar" post="Joint Head of Technical" link1="https://www.linkedin.com/in/ojash-bhatnagar-35b37a380/" link2="https://www.instagram.com/its_ojash08/" />
            <Person img={pradyumn} name="Pradyumn Kabra" post="Joint Head of Technical" link1="https://www.linkedin.com/in/pradyumn-kabra-b17386233/" link2="https://www.instagram.com/pradyumn.__k" />
            <Person img={shubhangi} name="Shubhangi Kesharwani" post="Joint Head of Research & Development" link1="https://www.linkedin.com/in/shubhangi-kesharwani-363189383/" link2="https://www.instagram.com/shubhangikesharwani21" />
            <Person img={riya} name="Riya Kumari" post="Joint Head of Research & Development" link1="https://www.linkedin.com/in/riya-kumari-5b302239a/" link2="https://www.instagram.com" />
            <Person img={sanaya} name="Sanaya Muchhal" post="Joint Head of Corporate Affairs" link1="https://www.linkedin.com/in/sanayamuchhal" link2="https://www.instagram.com/_.sanaya._07" />
            <Person img={chetna} name="Chetna Sharma" post="Joint Head of Graphic Design" link1="https://www.linkedin.com/in/chetna-sharma-13b1122ab" link2="https://www.instagram.com/miiss__so_yeon" />
            <Person img={nitigya} name="Nitigya Surana" post="Joint Head of Graphic Design" link1="https://www.linkedin.com/in/nitigya-surana-5b75a3379/" link2="https://www.instagram.com/nitigya_0607/" />
            <Person img={nileshwari} name="Nileshwari Patil" post="Joint Head of Media" link1="https://www.linkedin.com/in/nileshwari-patil-3b6380253" link2="https://www.instagram.com/nileshwaripatil9_" />
            <Person img={pranjal} name="Pranjal Patel" post="Joint Head of Media" link1="http://www.linkedin.com/in/pranjal-patel-53b272375" link2="https://www.instagram.com/pranjalpatel._" />
          </div>
        </div>

        {/* Senior Coordinators Section */}
        <div className="flex flex-col justify-center items-center w-full my-2 mb-16">
          <div className="relative mb-8">
            <h1 className="heads text-4xl sm:text-5xl md:text-6xl text-center tracking-tight font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(249,115,22,0.2)]">
              SENIOR CO-ORDINATORS
            </h1>
            <div className="h-[2px] w-28 mx-auto mt-2 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
          </div>
          <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full">
            <Person img={mayank} name="Mayank Pramanick" post="Senior Coordinator of Programs" link1="https://www.linkedin.com/" link2="https://www.instagram.com/" />
            <Person img={jiya} name="Jiya Chhabra" post="Senior Coordinator Marketing" link1="http://www.linkedin.com/in/jiya-chhabra-080776304" link2="https://www.instagram.com/jiya.chh_21" />
            <Person img={aditya} name="Aditya Tripathi" post="Senior Coordinator Technical" link1="https://www.linkedin.com/in/aditya-tripathi-922a2429a" link2="https://www.instagram.com/aditya._tripathi._" />
            <Person img={faisal} name="Mohammad Faisal" post="Senior Coordinator Technical" link1="https://www.linkedin.com/in/mohammed-faisal-833a81375" link2="https://www.instagram.com/treats_with_faisal" />
            <Person img={satyam} name="Satyam Jha" post="Senior Coordinator Research & Development" link1="https://www.linkedin.com/in/satyam-jha-26b310301/" link2="https://www.instagram.com/" />
            <Person img={saumya} name="Saumya Singh" post="Senior Coordinator Media" link1="https://www.linkedin.com/in/saumya-singh-799358381" link2="https://www.instagram.com" />
            <Person img={shashank} name="Shashank Singh" post="Senior Coordinator Operations & Logistics" link1="https://www.linkedin.com/" link2="https://www.instagram.com/og_shashank.30" />
            <Person img={lav} name="Lav Goyal" post="Senior Coordinator Operations & Logistics" link1="https://www.linkedin.com/in/lav-goyal-5a7215416" link2="https://www.instagram.com/lavv.goyal" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamPage;