import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, updateUserInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    bio: user?.user_metadata?.bio || "",
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const customer_email = user?.email;
        if (!customer_email) return;

        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_BASEURL
          }/api/paystack/subscriptions/${customer_email}`
        );
        const { data } = await res.json();
        console.log(data);

        if (data && data.length > 0) {
          setSubscription(data[0]);
        } else {
          const plansRes = await fetch(
            `${import.meta.env.VITE_BACKEND_BASEURL}/api/paystack/plans`
          );
          const { data } = await plansRes.json();
          setPlans(data);
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
        toast.error("Failed to load subscription info.");
      }
    };

    if (user) fetchSubscription();
  }, [user]);

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
      toast.success("Profile updated.");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.");
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Profile Info */}
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
        <CardContent className="space-y-4">
          {/* Full Name */}
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

          {/* Email */}
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-sm text-muted-foreground">{formData.email}</p>
          </div>

          {/* Phone */}
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

          {/* Bio */}
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
        </CardContent>
      </Card>

      {isEditing && (
        <Button className="mt-4" onClick={handleSave}>
          Save Changes
        </Button>
      )}

      {/* Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-2">
              <p>
                Hi <strong>{user.user_metadata.full_name}</strong>
              </p>
              <p>
                You're currently on the{" "}
                <strong>{subscription.plan.name}</strong> plan
              </p>
              <p>
                Status: <strong>{subscription.status}</strong>
              </p>
              <p>Subscription Code: {subscription.subscription_code}</p>
              <p>
                Card on file: {subscription.authorization.brand} ending in{" "}
                {subscription.authorization.last4}, expires{" "}
                {subscription.authorization.exp_month}/
                {subscription.authorization.exp_year}
              </p>
              <p>
                Next payment date:{" "}
                {new Date(subscription.next_payment_date).toLocaleDateString()}
              </p>
              <a
                href={`/update-payment-method?subscription_code=${subscription.subscription_code}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                Manage Subscription
              </a>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground mb-4">
                You're not on any plan. Select a plan below to subscribe:
              </p>
              <div className="flex flex-wrap gap-4">
                {plans.map((plan) => (
                  <Card key={plan.plan_code} className="w-64 text-center p-4">
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {plan.currency} {plan.amount / 100} / month
                    </p>
                    <p className="text-sm mt-2">{plan.description}</p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        // Call your signUpForPlan(plan.plan_code, plan.amount) here
                        // or trigger modal if not logged in
                        toast.info("Handle subscribe logic here");
                      }}
                    >
                      Subscribe
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
