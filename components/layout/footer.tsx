import LogoSquare from "components/logo-square";
import { FOOTER_SECTIONS } from "lib/constants";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#262626] bg-[#0a0a0a]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
        <div className="w-full">
          <div className="mb-6">
            <LogoSquare />
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="mb-3 text-sm font-semibold text-[#fafafa]">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.path}
                        className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[#262626] py-6 text-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p className="text-[#525252]">&copy; Upcube. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
