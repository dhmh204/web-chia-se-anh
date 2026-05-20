import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";

const roleOptions = [
  {
    value: "Thợ ảnh",
    name: "THO_ANH",
  },
  {
    value: "Admin",
    name: "ADMIN",
  },
];

const stateOptions = [
  {
    value: "Hoạt động",
    name: "HOAT_DONG",
  },
  {
    value: "Khóa",
    name: "KHOA",
  },
];

const passwordOptions = [
  {
    value: "Hệ thống tự sinh mật khẩu",
    name: "AUTO",
  },
  {
    value: "Tự nhập mật khẩu",
    name: "MANUAL",
  },
];

const FormCreateUse = () => {
  return (
    <form className="grid grid-cols-2 gap-[16px]" id="createStaffForm">
      <Input
        label="Họ và tên"
        name="name"
        placeholder="VD: Đào Hoàng Minh Hằng"
      />

      <Input
        label="Email đăng nhập"
        name="email"
        placeholder="minhanh@noofoto.vn"
      />

      <Input label="Số điện thoại" name="telphone" placeholder="0905 xxx xxx" />

      <SelectCustom label="Vai trò" values={roleOptions} />
      <SelectCustom label="Trạng thái tài khoản" values={stateOptions} />
      <SelectCustom label="Các cách cấp mật khẩu" values={passwordOptions} />

      {/* <div className="form-group">
        <label>Trạng thái ban đầu</label>
        <div className="custom-select" data-name="staffStatus">
          <button type="button" className="custom-select__trigger">
            <span data-selected>CHUA_DOI_MAT_KHAU</span>
            <span className="custom-select__arrow">⌄</span>
          </button>

          <div className="custom-select__menu">
            <button type="button" data-value="CHUA_DOI_MAT_KHAU">
              CHUA_DOI_MAT_KHAU
            </button>
            <button type="button" data-value="HOAT_DONG">
              HOAT_DONG
            </button>
          </div>

          <input type="hidden" id="staffStatus" value="CHUA_DOI_MAT_KHAU" />
        </div>
      </div>

      <div className="form-group">
        <label>Cách cấp mật khẩu</label>
        <div className="custom-select" data-name="staffStatus">
          <button type="button" className="custom-select__trigger">
            <span data-selected>Hệ thống tự sinh mật khẩu tạm</span>
            <span className="custom-select__arrow">⌄</span>
          </button>

          <div className="custom-select__menu">
            <button type="button" data-value="Hệ thống tự sinh mật khẩu tạm">
              Hệ thống tự sinh mật khẩu tạm
            </button>
            <button type="button" data-value="Admin nhập mật khẩu tạm">
              Admin nhập mật khẩu tạm
            </button>
          </div>

          <input type="hidden" id="staffStatus" value="CHUA_DOI_MAT_KHAU" />
        </div>
      </div>

      <div className="form-group full" id="manualPasswordGroup">
        <label>Mật khẩu tạm</label>
        <input
          id="manualPassword"
          className="input"
          placeholder="Nhập mật khẩu tạm"
        />
      </div>

      <div className="form-group full">
        <label>Ghi chú nội bộ</label>
        <textarea
          id="staffNote"
          className="textarea"
          placeholder="VD: Thợ ảnh phụ trách các dự án kỷ yếu, cưới hỏi..."
        ></textarea>
      </div>

      <div className="form-group full">
        <button className="btn primary" type="submit">
          Tạo tài khoản
        </button>
      </div> */}
    </form>
  );
};
export default FormCreateUse;
