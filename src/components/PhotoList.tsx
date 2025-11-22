import React from 'react';

const photos = [
  { id: 1, src: 'https://picsum.photos/seed/list1/1200/800', title: 'タイトル', date: '2024.10.10' },
  { id: 2, src: 'https://picsum.photos/seed/list2/1200/800', title: 'タイトル', date: '2024.10.10' },
  { id: 3, src: 'https://picsum.photos/seed/list3/1200/800', title: 'タイトル', date: '2024.10.10' },
  { id: 4, src: 'https://picsum.photos/seed/list4/1200/800', title: 'タイトル', date: '2024.10.10' },
  { id: 5, src: 'https://picsum.photos/seed/list5/1200/800', title: 'タイトル', date: '2024.10.10' },
];

export default function PhotoList() {
  return (
    <section className="max-w-[1200px] mx-auto px-8 py-20">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl font-sans tracking-widest uppercase">PHOTO LIST</h2>
        <a href="#" className="text-xs text-[var(--color-accent)] hover:text-black transition-colors tracking-widest">すべての写真を見る</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-28">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`group cursor-pointer ${index < 2 ? 'md:col-span-3' : 'md:col-span-2'}`}
          >
            <div className="overflow-hidden mb-4">
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full aspect-[3/2] object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
              />
            </div>
            <h3 className="text-sm font-medium tracking-wide mb-1">{photo.title}</h3>
            <p className="text-xs text-[var(--color-accent)] tracking-wider">{photo.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
