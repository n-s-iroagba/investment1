
import Image from 'next/image';
import { SocialMedia } from '@/types/socialMedia';
import { useGetList } from '@/hooks/useFetch';
import { apiRoutes } from '@/constants/apiRoutes';


const SocialMediaLinks = () => {


  const{data:socialMedias, loading, error} = useGetList<SocialMedia>(apiRoutes.socialMedia.list())
  if (loading) return <div>Loading social media links...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="social-media-section space-y-4">
      <h3 className="text-lg font-semibold">Connect With Us</h3>
      
      <div className="flex flex-wrap gap-4">
        {socialMedias.map((platform) => (
          <a
            key={platform.id}
            href={platform.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Image
              src={platform.logo} 
              alt={`${platform.name} logo`}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-social-icon.svg';
              }}
            />
            <span className="text-sm font-medium">{platform.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaLinks;