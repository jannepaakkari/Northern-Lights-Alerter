import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-bold mb-2">Subscribe to Northern Lights Updates</h1>
        <p className="text-lg">
          Never miss a magical moment! Get notified when the weather is perfect for spotting the Northern Lights in Finland—straight to your inbox.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-md">
        <Input
          fullWidth
          placeholder="Enter your email address"
          className="bg-white text-black"
          type="email"
        />
        <Button
          className={buttonStyles({ variant: "solid", radius: "full", size: "lg" })}
        >
          Subscribe
        </Button>
      </div>
      <div className="mt-6 text-center">
        <Snippet hideCopyButton hideSymbol variant="bordered" className="text-sm">
          <span>We respect your privacy. Unsubscribe anytime.</span>
        </Snippet>
        <br /><br />
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>
    </section>
  );
}
