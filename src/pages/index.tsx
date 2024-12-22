import { useRouter } from "next/router";
import Button from "@/components/button";

export default function Home({ role }: { role: string }) {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow items-center justify-around">
        <div className="flex h-full w-[80%] items-center justify-around">
          <Button
            onClick={() => {
              router.push({ pathname: "/student/view", query: { role } });
            }}
            text="View student"
            styling="h-[10%] w-1/6 rounded-lg bg-white text-black"
          />
          <Button
            onClick={() => {
              router.push({ pathname: "/class/view", query: { role } });
            }}
            text="View class"
            styling="h-[10%] w-1/6 rounded-lg bg-white text-black"
          />
        </div>
      </div>
    </div>
  );
}
