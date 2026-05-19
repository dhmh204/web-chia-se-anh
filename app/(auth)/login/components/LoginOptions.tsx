const LoginOptions = () => {
  return (
    <div className="flex items-center justify-between gap-[12px] text-[var(--muted)] text-[14px]">
      <label className="flex items-center gap-[8px]">
        <input
          type="checkbox"
          defaultChecked
          className="accent-[#10b981]"
        />
        Ghi nhớ đăng nhập
      </label>

      <a
        href="#"
        className="text-[var(--green-2)]"
      >
        Quên mật khẩu?
      </a>
    </div>
  );
};

export default LoginOptions;

