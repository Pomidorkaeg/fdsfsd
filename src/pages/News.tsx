import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { getAllNews } from '@/utils/news/newsOperations';
import type { NewsItem } from '@/utils/news/newsOperations';
import { useQuery } from '@tanstack/react-query';
import { newsApi } from '@/lib/api';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image?: string;
  date: string;
}

const News = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'matches' | 'club'>('all');
  const { data: news, isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: newsApi.getAll,
  });

  // Подписка на обновления в реальном времени
  useRealTimeUpdates('news:update', ['news']);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Произошла ошибка при загрузке новостей
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center p-4">
        Новости пока отсутствуют
      </div>
    );
  }

  const filteredNews = news.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="relative bg-fc-darkGreen text-white py-12">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1
            }}
          ></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Новости клуба</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Актуальные новости о матчах, событиях и жизни клуба
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-4 py-4">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'ghost'}
                onClick={() => setActiveFilter('all')}
                className={activeFilter === 'all' ? 'bg-fc-green hover:bg-fc-darkGreen' : ''}
              >
                Все новости
              </Button>
              <Button
                variant={activeFilter === 'matches' ? 'default' : 'ghost'}
                onClick={() => setActiveFilter('matches')}
                className={activeFilter === 'matches' ? 'bg-fc-green hover:bg-fc-darkGreen' : ''}
              >
                Матчи
              </Button>
              <Button
                variant={activeFilter === 'club' ? 'default' : 'ghost'}
                onClick={() => setActiveFilter('club')}
                className={activeFilter === 'club' ? 'bg-fc-green hover:bg-fc-darkGreen' : ''}
              >
                Клуб
              </Button>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                    <p className="text-gray-600">{item.content}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                <p>Новости не найдены</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
