"use client";

import React, { useState } from "react";
import AvatarUser from "@/components/AvatarUser";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { formatTrangThai, formatVaiTro } from "@/lib/format";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import ImageUploadInput from "@/components/ImageUploadInput";
import { toastNotify } from "@/components/Toast";

type UserType = {
  ma_nguoi_dung: string;
  ho_va_ten: string;
  email: string;
  so_dien_thoai: string | null;
  vai_tro: "ADMIN" | "THO_ANH";
  trang_thai: "HOAT_DONG" | "KHOA";
  ghi_chu: string | null;
  anh_dai_dien: string | null;
  _count: {
    su_phan_cong: number;
  };
};

type TableUserProps = {
  initialUsers: UserType[];
};

const roleOptions = [
  { value: "Thợ ảnh", name: "THO_ANH" },
  { value: "Admin", name: "ADMIN" },
];

const stateOptions = [
  { value: "Hoạt động", name: "HOAT_DONG" },
  { value: "Khóa", name: "KHOA" },
];

const TableUser = ({ initialUsers }: TableUserProps) => {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [confirmLockUser, setConfirmLockUser] = useState<UserType | null>(null);
  const [lockReason, setLockReason] = useState("");

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<"ADMIN" | "THO_ANH">("THO_ANH");
  const [editState, setEditState] = useState<"HOAT_DONG" | "KHOA">("HOAT_DONG");
  const [editNote, setEditNote] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = (user: UserType) => {
    setEditingUser(user);
    setEditName(user.ho_va_ten);
    setEditEmail(user.email);
    setEditPhone(user.so_dien_thoai || "");
    setEditRole(user.vai_tro);
    setEditState(user.trang_thai);
    setEditNote(user.ghi_chu || "");
    setEditPassword("");
    setAvatarPreview(user.anh_dai_dien || null);
    setAvatarFile(null);
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  // Handle user edit update submit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || isSaving) return;

    if (!editName.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập họ và tên.");
      return;
    }
    if (!editEmail.trim()) {
      toastNotify.error("Lỗi", "Vui lòng nhập email.");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("ma_nguoi_dung", editingUser.ma_nguoi_dung);
      formData.append("name", editName.trim());
      formData.append("email", editEmail.trim().toLowerCase());
      formData.append("telphone", editPhone.trim());
      formData.append("role", editRole);
      formData.append("stateAccount", editState);
      formData.append("note", editNote.trim());
      if (editPassword) {
        formData.append("password", editPassword.trim());
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.user) {
        toastNotify.success("Thành công", "Cập nhật tài khoản thành công!");
        
        // Update user inside the local list state, keeping count info
        setUsers((prev) =>
          prev.map((u) =>
            u.ma_nguoi_dung === editingUser.ma_nguoi_dung
              ? {
                  ...data.user,
                  _count: u._count, // preserve old assignments count
                }
              : u
          )
        );
        handleCloseEdit();
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể cập nhật tài khoản.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle lock confirm trigger
  const handleLockUser = (user: UserType) => {
    setConfirmLockUser(user);
    setLockReason(user.ghi_chu || "");
  };

  const handleConfirmLock = async () => {
    if (!confirmLockUser) return;
    const targetUser = confirmLockUser;
    setConfirmLockUser(null);

    try {
      const formData = new FormData();
      formData.append("ma_nguoi_dung", targetUser.ma_nguoi_dung);
      formData.append("name", targetUser.ho_va_ten);
      formData.append("email", targetUser.email);
      if (targetUser.so_dien_thoai) {
        formData.append("telphone", targetUser.so_dien_thoai);
      }
      formData.append("role", targetUser.vai_tro);
      formData.append("stateAccount", "KHOA");
      formData.append("note", lockReason.trim());

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.user) {
        toastNotify.success("Thành công", "Đã khóa tài khoản thành công!");
        setUsers((prev) =>
          prev.map((u) =>
            u.ma_nguoi_dung === targetUser.ma_nguoi_dung
              ? { ...u, ...data.user }
              : u
          )
        );
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể khóa tài khoản.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể kết nối máy chủ.");
    }
  };

  // Handle quick unlock
  const handleUnlockUser = async (user: UserType) => {
    try {
      const formData = new FormData();
      formData.append("ma_nguoi_dung", user.ma_nguoi_dung);
      formData.append("name", user.ho_va_ten);
      formData.append("email", user.email);
      if (user.so_dien_thoai) {
        formData.append("telphone", user.so_dien_thoai);
      }
      formData.append("role", user.vai_tro);
      formData.append("stateAccount", "HOAT_DONG");
      formData.append("note", user.ghi_chu || "");

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.user) {
        toastNotify.success("Thành công", "Mở khóa tài khoản thành công!");
        setUsers((prev) =>
          prev.map((u) =>
            u.ma_nguoi_dung === user.ma_nguoi_dung
              ? { ...u, ...data.user }
              : u
          )
        );
      } else {
        toastNotify.error("Thất bại", data.message || "Không thể mở khóa tài khoản.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Lỗi kết nối máy chủ.");
    }
  };

  return (
    <>
      <Table
        id="staffTableBody"
        headers={[
          "Nhân sự",
          "Email",
          "Vai trò",
          "Trạng thái",
          "Dự án phụ trách",
          "Thao tác",
        ]}
      >
        {users.map((user) => (
          <tr key={user.ma_nguoi_dung}>
            <td>
              <div className="flex items-center gap-[12px]">
                <div className="avatar">
                  <AvatarUser
                    name={user.ho_va_ten || ""}
                    avatarUrl={user.anh_dai_dien || ""}
                  />
                </div>
                <div>
                  <strong className="block mb-[3px] text-[14px]">
                    {user.ho_va_ten}
                  </strong>
                </div>
              </div>
            </td>
            <td>{user.email}</td>
            <td>
              <Badge
                label={formatVaiTro(user.vai_tro)}
                variant={user.vai_tro === "ADMIN" ? "completed" : "new"}
                className="uppercase"
              ></Badge>
            </td>
            <td>
              <Badge
                label={formatTrangThai(user.trang_thai)}
                variant={
                  user.trang_thai === "HOAT_DONG"
                    ? "completed"
                    : "pending"
                }
              ></Badge>
            </td>
            <td>
              {user.vai_tro === "ADMIN"
                ? "Toàn bộ hệ thống"
                : `${user._count.su_phan_cong} dự án`}
            </td>
            <td>
              <div className="flex flex-wrap gap-[12px]">
                {user.trang_thai === "HOAT_DONG" ? (
                  <>
                    <Button variant="sm" onClick={() => handleOpenEdit(user)}>
                      Sửa
                    </Button>
                    <Button variant="danger" onClick={() => handleLockUser(user)}>
                      Khóa
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="sm" onClick={() => handleOpenEdit(user)}>
                      Sửa
                    </Button>
                    <Button variant="sm" onClick={() => handleUnlockUser(user)}>
                      Mở khóa
                    </Button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <Modal
          title="Cập nhật tài khoản"
          kicker="THÀNH VIÊN"
          onClose={handleCloseEdit}
        >
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-[16px]">
            <ImageUploadInput
              name="avatar"
              variant="avatar"
              previewUrl={avatarPreview}
              onChange={(file) => {
                if (file) {
                  setAvatarFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setAvatarPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setAvatarFile(null);
                  setAvatarPreview(null);
                }
              }}
              onRemove={() => {
                setAvatarFile(null);
                setAvatarPreview(null);
              }}
              title="Ảnh hồ sơ thành viên"
              description="Hỗ trợ định dạng JPG, PNG. Ảnh sẽ được tự động đồng bộ và hiển thị trên toàn hệ thống quản trị."
            />

            <div className="grid grid-cols-2 gap-[16px]">
              <Input
                label="Họ và tên"
                name="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="VD: Đào Hoàng Minh Hằng"
                required
              />

              <Input
                label="Email đăng nhập"
                name="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="minhanh@noofoto.vn"
                required
              />

              <Input
                label="Số điện thoại"
                name="telphone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="0905 xxx xxx"
              />

              <SelectCustom
                label="Vai trò"
                values={roleOptions}
                name="role"
                value={editRole}
                onChange={(val) => setEditRole(val as any)}
              />

              <SelectCustom
                label="Trạng thái tài khoản"
                values={stateOptions}
                name="stateAccount"
                value={editState}
                onChange={(val) => setEditState(val as any)}
              />

              <Input
                label="Mật khẩu mới (Bỏ trống = Giữ nguyên)"
                name="password"
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="note"
                className="text-[#d1d5db] text-[13px] font-semibold"
              >
                Ghi chú
              </label>
              <textarea
                name="note"
                id="note"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="VD: Thợ ảnh phụ trách kỉ yếu,..."
                className="h-[116px] border border-[var(--line)] rounded-[15px] bg-[rgba(255,255,255,.04)] text-[var(--text)] p-[14px] outline-none transition-all duration-200 focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]"
              />
            </div>

            <div className="flex justify-end gap-[12px] mt-2 pt-4 border-t border-white/5">
              <Button type="button" variant="secondary" onClick={handleCloseEdit}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSaving} variant="primary">
                {isSaving ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {/* CUSTOM CONFIRM LOCK MODAL */}
      {confirmLockUser && (
        <Modal
          title="Khóa tài khoản"
          kicker="CẢNH BÁO"
          onClose={() => setConfirmLockUser(null)}
          widthClass="w-[min(460px,100%)]"
        >
          <div className="flex flex-col gap-4 text-[14px] p-1">
            <p className="text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn khóa tài khoản nhân sự <strong className="text-white">"{confirmLockUser.ho_va_ten}"</strong>?
            </p>
            <p className="text-slate-400 text-[12.5px] leading-relaxed">
              * Tài khoản bị khóa sẽ không thể đăng nhập vào hệ thống quản lý, nhưng thông tin phân công dự án cũ vẫn được lưu trữ.
            </p>
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[#d1d5db] text-[13px] font-semibold">Lý do khóa tài khoản (Ghi chú)</label>
              <textarea
                placeholder="Nhập lý do khóa tài khoản..."
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                className="h-[80px] border border-[var(--line)] rounded-[15px] bg-[rgba(255,255,255,.04)] text-[var(--text)] p-[14px] outline-none focus:border-[var(--line-green)] focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[14px]"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
              <Button 
                variant="secondary" 
                onClick={() => setConfirmLockUser(null)}
                className="min-h-[38px] px-4 rounded-[11px] text-[13px]"
              >
                Hủy
              </Button>
              <Button 
                variant="danger" 
                onClick={handleConfirmLock}
                className="min-h-[38px] px-5 rounded-[11px] text-[13px] bg-red-600 text-white hover:bg-red-700"
              >
                Khóa tài khoản
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TableUser;
