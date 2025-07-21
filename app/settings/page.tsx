'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    fitness_level: '',
    goals: '',
    notifications_email: true,
    notifications_push: true,
    privacy_profile: 'public',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);

      // Load user profile data
      setFormData({
        full_name: session.user.user_metadata?.full_name || '',
        email: session.user.email || '',
        phone: session.user.user_metadata?.phone || '',
        bio: session.user.user_metadata?.bio || '',
        fitness_level: session.user.user_metadata?.fitness_level || '',
        goals: session.user.user_metadata?.goals || '',
        notifications_email:
          session.user.user_metadata?.notifications_email ?? true,
        notifications_push:
          session.user.user_metadata?.notifications_push ?? true,
        privacy_profile:
          session.user.user_metadata?.privacy_profile || 'public',
      });

      setLoading(false);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
          fitness_level: formData.fitness_level,
          goals: formData.goals,
          notifications_email: formData.notifications_email,
          notifications_push: formData.notifications_push,
          privacy_profile: formData.privacy_profile,
        },
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update profile. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getUserName = (user: any) => {
    return (
      user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back
            </Button>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
              <p className='text-gray-600'>
                Manage your account and preferences
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className='bg-gradient-to-r from-purple-600 to-blue-600'
          >
            <Save className='w-4 h-4 mr-2' />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Tabs defaultValue='profile' className='space-y-4'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='profile'>Profile</TabsTrigger>
            <TabsTrigger value='account'>Account</TabsTrigger>
            <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            <TabsTrigger value='privacy'>Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value='profile' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and fitness details
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Avatar Section */}
                <div className='flex items-center space-x-4'>
                  <Avatar className='h-20 w-20'>
                    <AvatarImage
                      src={
                        user?.user_metadata?.avatar_url || '/placeholder.svg'
                      }
                      alt={getUserName(user)}
                    />
                    <AvatarFallback className='bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg'>
                      {getUserName(user).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant='outline' size='sm'>
                      <Camera className='w-4 h-4 mr-2' />
                      Change Photo
                    </Button>
                    <p className='text-sm text-muted-foreground mt-1'>
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='full_name'>Full Name</Label>
                    <Input
                      id='full_name'
                      value={formData.full_name}
                      onChange={(e) =>
                        handleInputChange('full_name', e.target.value)
                      }
                      placeholder='Enter your full name'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone Number</Label>
                    <Input
                      id='phone'
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      placeholder='Enter your phone number'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='bio'>Bio</Label>
                  <Input
                    id='bio'
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder='Tell us about yourself'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='fitness_level'>Fitness Level</Label>
                    <Select
                      value={formData.fitness_level}
                      onValueChange={(value) =>
                        handleInputChange('fitness_level', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select your fitness level' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='beginner'>Beginner</SelectItem>
                        <SelectItem value='intermediate'>
                          Intermediate
                        </SelectItem>
                        <SelectItem value='advanced'>Advanced</SelectItem>
                        <SelectItem value='expert'>Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='goals'>Primary Goal</Label>
                    <Select
                      value={formData.goals}
                      onValueChange={(value) =>
                        handleInputChange('goals', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select your primary goal' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='weight_loss'>Weight Loss</SelectItem>
                        <SelectItem value='muscle_gain'>Muscle Gain</SelectItem>
                        <SelectItem value='endurance'>Endurance</SelectItem>
                        <SelectItem value='strength'>Strength</SelectItem>
                        <SelectItem value='general_fitness'>
                          General Fitness
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='account' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and security
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input
                    id='email'
                    value={formData.email}
                    disabled
                    className='bg-muted'
                  />
                  <p className='text-sm text-muted-foreground'>
                    Email cannot be changed at this time
                  </p>
                </div>
                <Separator />
                <div className='space-y-4'>
                  <h3 className='text-lg font-medium'>Password</h3>
                  <Button variant='outline'>Change Password</Button>
                </div>
                <Separator />
                <div className='space-y-4'>
                  <h3 className='text-lg font-medium text-red-600'>
                    Danger Zone
                  </h3>
                  <Button variant='destructive'>Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='notifications' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Email Notifications</Label>
                    <p className='text-sm text-muted-foreground'>
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications_email}
                    onCheckedChange={(checked) =>
                      handleInputChange('notifications_email', checked)
                    }
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label>Push Notifications</Label>
                    <p className='text-sm text-muted-foreground'>
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications_push}
                    onCheckedChange={(checked) =>
                      handleInputChange('notifications_push', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='privacy' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='privacy_profile'>Profile Visibility</Label>
                  <Select
                    value={formData.privacy_profile}
                    onValueChange={(value) =>
                      handleInputChange('privacy_profile', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='public'>Public</SelectItem>
                      <SelectItem value='friends'>Friends Only</SelectItem>
                      <SelectItem value='private'>Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
