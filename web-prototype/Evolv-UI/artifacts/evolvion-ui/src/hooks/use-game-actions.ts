import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getGetClansQueryKey, getGetCharacterQueryKey } from "@workspace/api-client-react";

// These are simulated mutations since the OpenAPI spec only provided GET endpoints.
// In a real app, these would call real POST/PUT endpoints.

export function useJoinClan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clanId: number) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, clanId };
    },
    onSuccess: (_, clanId) => {
      toast({
        title: "Clan Joined!",
        description: "You have successfully joined the clan.",
      });
      // Optimistically update the cache
      queryClient.setQueryData(getGetClansQueryKey(), (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((clan: any) => 
          clan.id === clanId ? { ...clan, isJoined: true, memberCount: clan.memberCount + 1 } : clan
        );
      });
    }
  });
}

export function useEquipItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ slot, itemId }: { slot: string, itemId: number }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, slot, itemId };
    },
    onSuccess: (_, vars) => {
      toast({
        title: "Equipment Updated",
        description: `Successfully equipped new ${vars.slot}!`,
      });
      queryClient.invalidateQueries({ queryKey: getGetCharacterQueryKey() });
    }
  });
}

export function useCollectIdleRewards() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (amount: number) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, amount };
    },
    onSuccess: (data) => {
      toast({
        title: "Rewards Collected!",
        description: `+${data.amount} Resources added to your vault.`,
      });
    }
  });
}
