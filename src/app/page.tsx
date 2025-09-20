import type { Metadata } from "next";
import { RESUME_DATA } from "@/content/resume-data";
import { Education } from "@/components/cv-components/Education";
import { Header } from "@/components/cv-components/Header";
import { Projects } from "@/components/cv-components/Projects";
import { Skills } from "@/components/cv-components/Skills";
import { Summary } from "@/components/cv-components/Summary";
import { WorkExperience } from "@/components/cv-components/WorkExperience";

export const metadata: Metadata = {
  title: RESUME_DATA.name,
  description: RESUME_DATA.description,
};

export default function Home() {
  return (
    <main
      className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-11 md:p-16"
      id="main-content"
    >
      <div className="sr-only">
        <h1>{RESUME_DATA.name}&apos;s Resume</h1>
      </div>
      <section
        className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-4"
        aria-label="Resume Content"
      >
        <Header />
        <div className="space-y-8 print:space-y-4">
          <Summary summary={RESUME_DATA.summary} />
          <WorkExperience work={RESUME_DATA.work} />
          <Education education={RESUME_DATA.education} />
          <Skills skills={RESUME_DATA.skills} />
          <Projects projects={RESUME_DATA.projects} />
        </div>
      </section>
    </main>
  );
}
