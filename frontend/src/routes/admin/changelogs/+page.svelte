<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    function formatDate(dateString: string) {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }
</script>

<div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Daftar Changelog</h1>
    <a href="/admin/changelogs/new" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        + Buat Baru
    </a>
</div>

<div class="bg-gray-800 rounded-lg overflow-x-auto">
    {#if data.changelogs && data.changelogs.length > 0}
        <table class="w-full text-sm text-left text-gray-300">
            <thead class="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                    <th scope="col" class="px-6 py-3">Judul</th>
                    <th scope="col" class="px-6 py-3">Kategori</th>
                    <th scope="col" class="px-6 py-3">Tanggal</th>
                    <th scope="col" class="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each data.changelogs as changelog (changelog.id)}
                    <tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                        <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-white">
                            {changelog.title}
                        </th>
                        <td class="px-6 py-4 capitalize">
                            {changelog.category}
                        </td>
                        <td class="px-6 py-4">
                            {formatDate(changelog.created_at)}
                        </td>
                        <td class="px-6 py-4 text-right flex justify-end items-center gap-4">
                            <a href="/admin/changelogs/edit/{changelog.id}" class="font-medium text-blue-500 hover:underline">Edit</a>
                            <form 
                                method="POST" 
                                action="?/delete"
                                on:submit|preventDefault={(e) => {
                                    if (confirm('Apakah Anda yakin ingin menghapus changelog ini? Ini tidak bisa dibatalkan.')) {
                                        e.currentTarget.submit();
                                    }
                                }}
                            >
                                <input type="hidden" name="id" value={changelog.id} />
                                <button type="submit" class="font-medium text-red-500 hover:underline">
                                    Delete
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p class="text-center text-gray-400 p-6">Belum ada changelog. Silakan buat yang baru.</p>
    {/if}
</div>