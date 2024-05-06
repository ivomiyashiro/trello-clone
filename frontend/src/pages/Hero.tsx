import { useTheme } from "@/hooks";
import { Button } from "@/components/ui";

const Hero = () => {
  const { toggleTheme } = useTheme();

  return (
    <div>
      <Button onClick={toggleTheme}>hola</Button>
    </div>
  );
};

export default Hero;
