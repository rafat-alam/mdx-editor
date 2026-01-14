import { Button } from "@/components/ui/button";

export function SUB() {
  return (
    <div className="flex flex-wrap items-center md:flex-row">
      <a href="/signup">
        <Button variant="outline">
          <b>SignUp</b>
        </Button>
      </a>
    </div>
  );
}