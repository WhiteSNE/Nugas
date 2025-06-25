<script lang="ts">
    import type { User } from '$lib/types/user';
    import { goto } from '$app/navigation';
  
    export let data: {
      user: any;
      users: {
        data: User[];
        total: number;
        page: number;
        pages: number;
      };
      search: string;
      page: number;
    };
  
    let search = data.search;
    let users = data.users.data;
    let totalPages = data.users.pages;
    let currentPage = data.page;
  
    const doSearch = () => {
      goto(`?search=${search}&page=1`);
    };
  
    const goToPage = (p: number) => {
      goto(`?search=${search}&page=${p}`);
    };
  
    const roles = ['admin', 'client'];
    const statuses = ['active', 'pending_verification', 'suspended'];
  
    const updateUser = async (id: number, role: string, status: string) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role, status })
      });
  
      const result = await res.json();
      if (res.ok) {
        alert('User updated');
      } else {
        alert(`Error: ${result.message}`);
      }
    };
  
    const deleteUser = async (id: number) => {
      if (!confirm('Are you sure you want to delete this user?')) return;
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
  
      if (res.ok) {
        users = users.filter((u) => u.id !== id);
      } else {
        alert('Failed to delete user');
      }
    };
  </script>
  
  <!-- UI tetap seperti sebelumnya -->
  
  <h1 class="text-2xl font-bold mb-4">Kelola Pengguna</h1>
  <!-- Search -->
  <div class="flex items-center justify-between mb-4">
    <input
      bind:value={search}
      on:keydown={(e) => e.key === 'Enter' && doSearch()}
      class="w-full md:w-1/3 p-2 rounded bg-gray-800 border border-slate-600 text-white"
      placeholder="Cari nama atau email..."
    />
    <button
      on:click={doSearch}
      class="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Cari
    </button>
  </div>  
  <table class="table-auto w-full border text-sm">
    <thead class="bg-gray-800 text-white">
      <tr>
        <th class="p-2 border">ID</th>
        <th class="p-2 border">Email</th>
        <th class="p-2 border">Nama</th>
        <th class="p-2 border">Role</th>
        <th class="p-2 border">Status</th>
        <th class="p-2 border">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr class="border hover:bg-gray-100 dark:hover:bg-gray-700">
          <td class="p-2 border">{user.id}</td>
          <td class="p-2 border">{user.email}</td>
          <td class="p-2 border">{user.name}</td>
          <td class="p-2 border">
            <select bind:value={user.role} on:change={() => updateUser(user.id, user.role, user.status)}>
              {#each roles as role}
                <option value={role}>{role}</option>
              {/each}
            </select>
          </td>
          <td class="p-2 border">
            <select bind:value={user.status} on:change={() => updateUser(user.id, user.role, user.status)}>
              {#each statuses as status}
                <option value={status}>{status}</option>
              {/each}
            </select>
          </td>
          <td class="p-2 border text-center">
            <button class="bg-red-600 text-white px-2 py-1 rounded" on:click={() => deleteUser(user.id)}>
              Hapus
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <!-- Pagination -->
<div class="mt-4 flex gap-2 flex-wrap">
    {#each Array(totalPages) as _, index}
      <button
        on:click={() => goToPage(index + 1)}
        class="px-3 py-1 rounded border text-white"
        class:border-blue-500={currentPage === index + 1}
        class:bg-blue-600={currentPage === index + 1}
        class:bg-gray-800={currentPage !== index + 1}
      >
        {index + 1}
      </button>
    {/each}
  </div>
  