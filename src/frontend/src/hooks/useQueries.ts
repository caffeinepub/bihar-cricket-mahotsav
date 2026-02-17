import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, PlayerRegistration, SponsorInquiry, TeamInfo, Team, PlayerCategory, CricketExperience, JerseySize, AdminDashboardStats, RegistrationAnalytics, SponsorInquiryStatus, UserRole, PaymentSuccessResponse } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import { useInternetIdentity } from './useInternetIdentity';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Role Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Get Caller ID as Text - authentication-aware with identity-based cache key
export function useGetCallerIdAsText() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  // Get principal string for cache key (ensures fresh query on identity change)
  const principalKey = identity ? identity.getPrincipal().toString() : 'anonymous';
  const isAuthenticated = !!identity && principalKey !== '2vxsx-fae'; // Not anonymous principal

  return useQuery<string>({
    queryKey: ['callerIdAsText', principalKey],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!isAuthenticated) throw new Error('Not authenticated');
      return actor.getCallerIdAsText();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    retry: 2,
    retryDelay: 1000,
  });
}

// Get Caller User Role
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Assign Caller User Role (Admin Setup / Bootstrap)
export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.assignCallerUserRole(data.user, data.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
      toast.success('Admin role assigned successfully');
    },
    onError: (error: any) => {
      console.error('Failed to assign admin role:', error);
      toast.error(error?.message || 'Failed to assign admin role');
    },
  });
}

// Payment Success - Query hook for fetching payment verification
export function usePaymentSuccessQuery(sessionId: string, accountId: string, caffeineCustomerId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentSuccessResponse>({
    queryKey: ['paymentSuccess', sessionId, accountId, caffeineCustomerId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.paymentSuccess(sessionId, accountId, caffeineCustomerId);
    },
    enabled: !!actor && !isFetching && !!sessionId && !!accountId && !!caffeineCustomerId,
    retry: 1,
  });
}

// Payment Success - Mutation hook (kept for backward compatibility if needed elsewhere)
export function usePaymentSuccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { sessionId: string; accountId: string; caffeineCustomerId: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.paymentSuccess(data.sessionId, data.accountId, data.caffeineCustomerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerRegistration'] });
      queryClient.invalidateQueries({ queryKey: ['allPlayerRegistrations'] });
    },
  });
}

// Player Registration Queries
export function useGetPlayerRegistration() {
  const { actor, isFetching } = useActor();

  return useQuery<PlayerRegistration | null>({
    queryKey: ['playerRegistration'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlayerRegistration();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitPlayerRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      age: bigint;
      contact: string;
      email: string;
      aadhaarNumber: string;
      experience: CricketExperience;
      teamChoice: Team;
      category: PlayerCategory;
      jerseySize: JerseySize;
      paymentStatus: boolean;
      userId: string | null;
      anonymous: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitPlayerRegistration(
        data.name,
        data.age,
        data.contact,
        data.email,
        data.aadhaarNumber,
        data.experience,
        data.teamChoice,
        data.category,
        data.jerseySize,
        data.paymentStatus,
        data.userId,
        data.anonymous
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerRegistration'] });
      queryClient.invalidateQueries({ queryKey: ['registrationCount'] });
      toast.success('Registration submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to submit registration');
    },
  });
}

// Get Registration Count
export function useGetRegistrationCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['registrationCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getRegistrationCount();
    },
    enabled: !!actor && !isFetching,
  });
}

// Checkout
export function useCheckout() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.checkout();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to initiate checkout');
    },
  });
}

// Admin Queries
export function useGetAllPlayerRegistrations() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, PlayerRegistration]>>({
    queryKey: ['allPlayerRegistrations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayerRegistrations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAnonymousRegistrations() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, PlayerRegistration]>>({
    queryKey: ['allAnonymousRegistrations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAnonymousRegistrations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePlayerPaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userPrincipal: Principal | null;
      anonymousId: string | null;
      paymentStatus: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updatePlayerPaymentStatus(
        data.userPrincipal,
        data.anonymousId,
        data.paymentStatus
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPlayerRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['allAnonymousRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      toast.success('Payment status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update payment status');
    },
  });
}

// Sponsor Inquiries
export function useSubmitSponsorInquiry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      company: string;
      contact: string;
      sponsorshipLevel: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitSponsorInquiry(
        data.name,
        data.company,
        data.contact,
        data.sponsorshipLevel,
        data.message
      );
    },
    onSuccess: () => {
      toast.success('Sponsorship inquiry submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to submit inquiry');
    },
  });
}

export function useGetAllSponsorInquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, SponsorInquiry]>>({
    queryKey: ['allSponsorInquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSponsorInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSponsorInquiryStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { inquiryId: bigint; status: SponsorInquiryStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateSponsorInquiryStatus(data.inquiryId, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSponsorInquiries'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      toast.success('Inquiry status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update inquiry status');
    },
  });
}

export function useDeleteSponsorInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiryId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteSponsorInquiry(inquiryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSponsorInquiries'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      toast.success('Inquiry deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete inquiry');
    },
  });
}

// Teams
export function useGetTeams() {
  const { actor, isFetching } = useActor();

  return useQuery<TeamInfo[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSortedTeamInfos();
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin Dashboard Stats
export function useGetAdminDashboardStats() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminDashboardStats>({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// Registration Analytics
export function useGetRegistrationAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<RegistrationAnalytics>({
    queryKey: ['registrationAnalytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRegistrationAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

// Dropdown data
export function useListTeams() {
  const { actor, isFetching } = useActor();

  return useQuery<Team[]>({
    queryKey: ['teamsList'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTeams();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<PlayerCategory[]>({
    queryKey: ['categoriesList'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListExperienceLevels() {
  const { actor, isFetching } = useActor();

  return useQuery<CricketExperience[]>({
    queryKey: ['experienceLevelsList'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listExperienceLevels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListJerseySizes() {
  const { actor, isFetching } = useActor();

  return useQuery<JerseySize[]>({
    queryKey: ['jerseySizesList'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listJerseySizes();
    },
    enabled: !!actor && !isFetching,
  });
}
