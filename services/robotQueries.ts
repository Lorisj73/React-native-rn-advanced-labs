import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as repo from './robotRepo';

export const queryClient = new QueryClient();

const keys = {
  robots: {
    root: ['robots'] as const,
    list: (p: repo.ListParams) => ['robots', 'list', p.q || '', p.sort || 'name'] as const,
    detail: (id?: string) => ['robots', 'detail', id] as const,
  },
};

export function useRobotsQuery(params: repo.ListParams) {
  return useQuery({
    queryKey: keys.robots.list(params),
    queryFn: () => repo.list(params),
  });
}

export function useRobotQuery(id?: string) {
  return useQuery({
    queryKey: keys.robots.detail(id),
    queryFn: () => (id ? repo.getById(id) : Promise.resolve(undefined)),
    enabled: !!id,
  });
}

export function useCreateRobotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.robots.root });
    },
  });
}

export function useUpdateRobotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: repo.RobotInput }) => repo.update(id, changes),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: keys.robots.root });
      qc.invalidateQueries({ queryKey: keys.robots.detail(vars.id) });
    },
  });
}

export function useDeleteRobotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.robots.root });
    },
  });
}

export function useExportRobotsMutation() {
  return useMutation({
    mutationFn: repo.exportToJson,
  });
}

export function useImportPickedFileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.importFromPickedFile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.robots.root });
    },
  });
}
