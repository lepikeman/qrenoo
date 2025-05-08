"use client";

import Link from "next/link";
import Image from "next/image";
import coiffeurImg from "@/public/images/jobs/coiffeur.jpg";
import nettoyeurImg from "@/public/images/jobs/nettoyeur.jpg";
import coachImg from "@/public/images/jobs/coach.jpg";

export default function JobsList() {
  const jobs = [
    {
      title: "Coiffeurs & Barbiers",
      description:
        "Gérez efficacement votre salon et réduisez les rendez-vous manqués",
      image: coiffeurImg,
      link: "/jobs/prise-de-rendez-vous-coiffeur",
    },
    {
      title: "Nettoyeurs & Centre de Lavage",
      description: "Optimisez la gestion de votre centre de lavage",
      image: nettoyeurImg,
      link: "/jobs/prise-de-rendez-vous-nettoyeur-auto",
    },
    {
      title: "Coachs & Consultants",
      description: "Planifiez vos séances individuelles et collectives",
      image: coachImg,
      link: "/jobs/prise-de-rendez-vous-coach",
    },
  ];

  return (
    <div className="w-full px-4 py-12 flex flex-col items-center bg-[#f6f8f2]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
          Solutions par métier
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-[#efe9db] overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={job.image}
                  alt={job.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#29381a]/50"></div>
                <div className="absolute inset-0 flex items-end justify-start p-6">
                  <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#405c26] mb-4">{job.description}</p>
                <Link
                  href={job.link}
                  className="text-[#29381a] font-medium hover:text-[#405c26] transition-colors flex items-center"
                >
                  Découvrir la solution
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
