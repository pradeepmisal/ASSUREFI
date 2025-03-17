
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  CreditCard, 
  Code, 
  CheckCircle,
  Wallet,
  UploadCloud,
  Camera
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [formState, setFormState] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Blockchain developer and DeFi security researcher with 5+ years of experience in smart contract auditing.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    apiKey: "sk_test_••••••••••••••••••••••••",
    notifySecurityAlerts: true,
    notifyPortfolioChanges: true,
    notifyMarketUpdates: false,
    notifyNewFeatures: true,
    address: "0xDe34...8b24"
  });

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "User Profile - AssureFi Guardian";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (!formState.currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive",
      });
      return;
    }
    
    if (formState.newPassword !== formState.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (formState.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setFormState(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    }, 1000);
  };

  const regenerateApiKey = () => {
    // In a real app, this would call an API to regenerate the key
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setFormState(prev => ({
        ...prev,
        apiKey: "sk_test_" + Math.random().toString(36).substring(2, 15)
      }));
      
      toast({
        title: "API Key Regenerated",
        description: "Your new API key has been generated. Make sure to save it.",
      });
    }, 1000);
  };

  return (
    <DashboardLayout title="Profile Settings" description="Manage your account settings and preferences">
      <div className="grid gap-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    <CardTitle>Personal Information</CardTitle>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isSaving}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
                <CardDescription>
                  Manage your personal details and account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="h-32 w-32 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                        {profileImageUrl ? (
                          <img 
                            src={profileImageUrl} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-16 w-16 text-slate-400" />
                        )}
                      </div>
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <label htmlFor="profile-image" className="cursor-pointer flex items-center justify-center h-10 w-10 rounded-full bg-white">
                            <Camera className="h-5 w-5 text-slate-700" />
                            <input
                              type="file"
                              id="profile-image"
                              className="hidden"
                              accept="image/*"
                              onChange={handleProfileImageChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium">{formState.name}</h3>
                      <p className="text-sm text-muted-foreground">{formState.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Premium User</Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formState.bio}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted resize-none h-24" : "resize-none h-24"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter className="justify-end border-t pt-4">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <CardTitle>Security Settings</CardTitle>
                </div>
                <CardDescription>
                  Manage your password and account security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formState.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formState.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formState.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button 
                      onClick={handlePasswordChange} 
                      className="w-full md:w-auto md:self-end"
                      disabled={isSaving}
                    >
                      {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Protect your account with 2FA</div>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session Management</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-sm text-muted-foreground">
                          Chrome on Windows • IP: 192.168.1.1
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last active: {new Date().toLocaleString()}
                        </div>
                      </div>
                      <Badge>Active Now</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Sign Out All Other Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
                <CardDescription>
                  Choose what updates you want to receive and how
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Security Alerts</div>
                        <div className="text-sm text-muted-foreground">
                          Get notified about important security issues
                        </div>
                      </div>
                      <Switch
                        checked={formState.notifySecurityAlerts}
                        onCheckedChange={(checked) => handleSwitchChange('notifySecurityAlerts', checked)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Portfolio & Market Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Portfolio Changes</div>
                          <div className="text-sm text-muted-foreground">
                            Notify when wallet value changes significantly
                          </div>
                        </div>
                        <Switch
                          checked={formState.notifyPortfolioChanges}
                          onCheckedChange={(checked) => handleSwitchChange('notifyPortfolioChanges', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Market Updates</div>
                          <div className="text-sm text-muted-foreground">
                            Receive major market movement alerts
                          </div>
                        </div>
                        <Switch
                          checked={formState.notifyMarketUpdates}
                          onCheckedChange={(checked) => handleSwitchChange('notifyMarketUpdates', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Platform Updates</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">New Features</div>
                        <div className="text-sm text-muted-foreground">
                          Be the first to know about new platform features
                        </div>
                      </div>
                      <Switch
                        checked={formState.notifyNewFeatures}
                        onCheckedChange={(checked) => handleSwitchChange('notifyNewFeatures', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t pt-4">
                <Button onClick={() => {
                  toast({
                    title: "Preferences Saved",
                    description: "Your notification preferences have been updated.",
                  });
                }}>
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* API Keys Tab */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  <CardTitle>API Access</CardTitle>
                </div>
                <CardDescription>
                  Manage your API keys for programmatic access to the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-md bg-slate-50 border">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">Primary API Key</div>
                      <div className="text-sm font-mono mt-1">{formState.apiKey}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Created: May 12, 2024 • Last used: 2 days ago
                      </div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={regenerateApiKey} disabled={isSaving}>
                      {isSaving ? "Regenerating..." : "Regenerate Key"}
                    </Button>
                    <Button variant="outline" size="sm">Copy Key</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">API Usage Guidelines</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Do not share your API key with others or expose it in client-side code</li>
                    <li>Rate limits: 60 requests per minute, 1000 requests per day</li>
                    <li>All API requests must use HTTPS</li>
                    <li>API documentation is available in the Developer Hub</li>
                  </ul>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline">View API Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Wallets Tab */}
          <TabsContent value="wallets">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-500" />
                  <CardTitle>Connected Wallets</CardTitle>
                </div>
                <CardDescription>
                  Manage wallets connected to your AssureFi account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-md bg-slate-50 border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">MetaMask</div>
                        <div className="text-sm font-mono">{formState.address}</div>
                      </div>
                    </div>
                    <Badge>Primary</Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">Disconnect</Button>
                    <Button variant="outline" size="sm">View on Etherscan</Button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Connect Another Wallet</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Add more wallets to monitor and protect your assets across multiple addresses
                  </p>
                  <Button>Connect Wallet</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
