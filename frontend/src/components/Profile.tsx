import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { user, updateUserInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "", // Display-only
    phone: user?.user_metadata?.phone || "",
    bio: user?.user_metadata?.bio || "",
  });

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Please sign in to view your profile
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { error } = await updateUserInfo({
        full_name: formData.fullName,
      });

      if (error) throw error;

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Full Name</h3>
              {isEditing ? (
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {formData.fullName}
                </p>
              )}
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
            </div>
            <div>
              <h3 className="font-medium">Phone</h3>
              {isEditing ? (
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {formData.phone || "N/A"}
                </p>
              )}
            </div>
            <div>
              <h3 className="font-medium">Bio</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Tell us about yourself"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {formData.bio || "No bio yet"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <Button className="mt-4" onClick={handleSave}>
          Save Changes
        </Button>
      )}
    </div>
  );
};

export default ProfilePage;
