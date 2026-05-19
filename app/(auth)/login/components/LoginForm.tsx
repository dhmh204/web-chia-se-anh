import Button from "@/components/Button";
import Input from "@/components/Input";
import LoginOptions from "./LoginOptions";

const LoginForm = () => {
  return (
    <div className="flex items-center justify-center p-[36px]">
      <div className=" w-[min(530px,100%)] p-[40px] border border-[rgba(16,185,129,0.28)] rounded-[34px] shadow-[0_0_80px_rgba(16,185,129,0.16)] backdrop-blur-[18px] bg-[rgba(3,7,10,0.76)] ">
        <h2 className="text-[32px] tracking-[-0.04em] text-center font-bold mb-[30px]">
          Đăng nhập hệ thống
        </h2>
        <form className="grid gap-[30px]">
          <Input label="Email" placeholder="abc@gmaill.com" name="Email" />
          <Input label="Mật khẩu" placeholder="Nhập mật khẩu" name="password" />
          <LoginOptions></LoginOptions>
          <Button variant="primary" type="submit">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
