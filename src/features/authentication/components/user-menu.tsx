"use client";

import * as React from "react";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user.store";
import { useLogout } from "@/features/authentication/hooks/use-logout";

export function UserMenu() {
  const user = useUserStore((s) => s.user);
  const logout = useLogout();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white transition-transform hover:scale-105"
            aria-label="User menu"
          >
            {user?.username?.[0]?.toUpperCase() ?? <User className="size-4" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user?.username ?? "Người dùng"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-[var(--color-danger)]"
            onSelect={() => setConfirmOpen(true)}
          >
            <LogOut className="size-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal open={confirmOpen} onOpenChange={setConfirmOpen}>
        <ModalContent className="max-w-sm">
          <ModalHeader>
            <ModalTitle>Đăng xuất</ModalTitle>
            <ModalDescription>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</ModalDescription>
          </ModalHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={logout.isPending}
              onClick={() => logout.mutate()}
            >
              Đăng xuất
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
