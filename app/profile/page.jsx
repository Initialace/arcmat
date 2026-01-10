"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Container from '@/components/ui/Container';
import { useAuth } from '@/hooks/useAuth';
import { useLoader } from '@/context/LoaderContext';
import { useGetVendors, useCreateVendor, useUpdateVendor } from '@/hooks/useVendor';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfileForm from '@/components/profile/ProfileForm';
import { toast } from '@/components/ui/Toast';

const ProfilePage = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const { data: vendorsData, isLoading: isVendorsLoading } = useGetVendors();
    const { mutate: createVendor, isPending: isCreating } = useCreateVendor();
    const { mutate: updateVendor, isPending: isUpdating } = useUpdateVendor();

    useEffect(() => {
        setLoading(isVendorsLoading);
    }, [isVendorsLoading, setLoading]);

    const [isEditing, setIsEditing] = useState(false);
    const [currentVendor, setCurrentVendor] = useState(null);

    useEffect(() => {
        let vendorsList = [];
        if (Array.isArray(vendorsData)) {
            vendorsList = vendorsData;
        } else if (vendorsData?.data && Array.isArray(vendorsData.data)) {
            vendorsList = vendorsData.data;
        } else if (vendorsData?.vendors && Array.isArray(vendorsData.vendors)) {
            vendorsList = vendorsData.vendors;
        }

        if (vendorsList.length > 0 && user) {
            const userId = user._id || user.id;

            const foundVendor = vendorsList.find(v => {
                return String(v.userId) === String(userId);
            });

            setCurrentVendor(foundVendor || null);
        } else {
            setCurrentVendor(null);
        }
    }, [vendorsData, user]);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleCreateOrUpdate = async (data) => {
        try {
            const payload = {
                name: data.name,
                country: data.country,
                description: data.description,
                website: data.website,
                shippingAddress: data.shippingAddress,
                billingAddress: data.billingAddress,
                isActive: data.isActive
            };

            if (!currentVendor && user) {
                payload.userId = user._id || user.id;
            }

            if (data.logo && data.logo[0]) {
                const base64Logo = await fileToBase64(data.logo[0]);
                payload.logo = base64Logo;
            }

            if (currentVendor) {
                updateVendor({ id: currentVendor._id || currentVendor.id, data: payload }, {
                    onSuccess: () => {
                        toast.success('Profile updated successfully', 'Success');
                        setIsEditing(false);
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Failed to update profile', 'Error');
                    }
                });
            } else {
                createVendor(payload, {
                    onSuccess: () => {
                        toast.success('Profile created successfully', 'Success');
                        setIsEditing(false);
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Failed to create profile', 'Error');
                    }
                });
            }
        } catch (error) {
            console.error("Error preparing payload:", error);
            toast.error("Failed to prepare profile data", "Error");
        }
    };

    if (isVendorsLoading) {
        return null;
    }

    if (user && user.role !== 'vendor') {
        return (
            <div className=" bg-white flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center bg-gray-50 h-[500px]">
                    <Container>
                        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">

                            <h2 className="text-xl font-bold text-gray-800 mb-2">Customer Profile feature coming soon!!</h2>
                        </div>
                    </Container>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-grow py-10 bg-gray-50">
                <Container>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {currentVendor ? 'Vendor Profile' : 'Create Vendor Profile'}
                            </h1>
                        </div>

                        <div className="p-8">
                            {!currentVendor && !isEditing ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Plus className="text-gray-400" size={32} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Profile Found</h3>
                                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                        You haven't set up your vendor profile yet. Create one to start managing your brand presence.
                                    </p>
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-[#e09a74] py-2 px-4 cursor-pointer text-white hover:bg-white hover:text-[#e09a74] hover:border-[#e09a74] border"
                                        text="Create Profile"
                                    />
                                </div>
                            ) : isEditing ? (
                                <ProfileForm
                                    vendor={currentVendor}
                                    defaultName={user?.name}
                                    onSubmit={handleCreateOrUpdate}
                                    onCancel={currentVendor ? () => setIsEditing(false) : null}
                                    isSubmitting={isCreating || isUpdating}
                                />
                            ) : (
                                <ProfileDetails
                                    vendor={currentVendor}
                                    onEdit={() => setIsEditing(true)}
                                />
                            )}
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;
