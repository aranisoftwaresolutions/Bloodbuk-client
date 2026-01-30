import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBanners } from "../../../redux/slices/bannerSlices";
import { fetchBannerss } from "../../../redux/slices/bannersSlices";

// Skeleton Loader Component
const BannerSkeleton = () => {
    return (
        <div className="relative w-full h-full bg-gray-200 overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Image Placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <svg
                    className="w-20 h-20 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            {/* Skeleton Pagination Dots */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 flex justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    />
                ))}
            </div>
        </div>
    );
};

const Banner = () => {
    const dispatch = useDispatch();
    const { banners: bannerss, loading } = useSelector((state) => state.bannerss);

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchBannerss());
    }, [dispatch]);

    return (
        <section className="relative pt-[5.3rem] w-full h-[98vh] flex items-center justify-center bg-gray-100">
            <div className="w-full h-full flex items-center justify-between">
                {/* Image Slider Section */}
                <div className="flex-grow w-full md:w-1/2 h-full md:h-screen overflow-hidden flex justify-center items-center border border-gray-600 transition-all duration-300 hover:shadow-xl">
                    {loading || !bannerss || bannerss.length === 0 ? (
                        <BannerSkeleton />
                    ) : (
                        <>
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                pagination={{
                                    clickable: true,
                                    el: '.banner-pagination',
                                    bulletClass: 'swiper-pagination-bullet',
                                    bulletActiveClass: 'swiper-pagination-bullet-active'
                                }}
                                loop={true}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                speed={800}
                                className="w-full h-full"
                            >
                                {bannerss?.flatMap((bannerss) =>
                                    bannerss.photos.map((photo, index) => (
                                        <SwiperSlide key={photo._id} className="flex justify-center items-center w-full h-full">
                                            <img
                                                src={photo.url}
                                                alt={`Fashion Slide ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                                                loading="lazy"
                                            />
                                        </SwiperSlide>
                                    ))
                                )}
                            </Swiper>
                            {/* Custom Pagination Container */}
                            <div className="banner-pagination absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 flex justify-center space-x-2" />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Banner;
