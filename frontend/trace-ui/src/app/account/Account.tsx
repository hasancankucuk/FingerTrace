import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getToken,
  updateUser,
} from "@/services/auth";
import { toast, Toaster } from "sonner";
import { DeleteAccountModal } from "./DeleteAccountModal";

export const Account = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const user = await getCurrentUser();
    setName(user.name || "");
    setEmail(user.email || "");
  };

  const saveChanges = async () => {
    try {
      await updateUser(name, email);
      toast("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const deleteAccount = async () => {
    setShowDeleteAccountModal(true);
  };
  return (
    <>
      <Toaster />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Personal Information</h1>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Profile</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update your personal information below.
            </p>

            <div className="grid gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row justify-between items-start">
              <Button
                className="mt-2 w-fit"
                onClick={deleteAccount}
                variant="destructive"
              >
                Delete Account
              </Button>
              <Button className="mt-2 w-fit" onClick={saveChanges}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {showDeleteAccountModal && (
        <DeleteAccountModal
          showModal={showDeleteAccountModal}
          setShowModal={setShowDeleteAccountModal}
        />
      )}
    </>
  );
};
