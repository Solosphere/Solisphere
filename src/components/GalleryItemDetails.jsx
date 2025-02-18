import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'; 
import products from '../productsData';

const GalleryItemDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page');

  const navigate = useNavigate();
  
  const product = products.find((p) => p.id === parseInt(id, 10));

  useEffect(() => {
    window.scrollTo(0, 0);
  })

  if (!product) {
    return <p>Product not found.</p>;
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % product.image.length;
    setCurrentImageIndex(nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + product.image.length) % product.image.length;
    setCurrentImageIndex(prevIndex);
  };

  const handleThumbnailClick = (index) => {
    if (product.image[index].includes('/videos/')) {
      // If the clicked thumbnail is a video, set the index to the first video in the array
      const videoIndex = product.image.findIndex((item) => item.includes('/videos/'));
      setCurrentImageIndex(videoIndex);
    } else {
      // If it's an image, set the index to the clicked image index
      setCurrentImageIndex(index);
    }
  };

  const handleGoBack = () => {
    navigate(`/archive?page=${page}`);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="gallery-details">
      <div className="gallery-nav">
        <button className="back-button" onClick={handleGoBack}>
          Back to Archive
        </button>
      </div>
      <div className="details-container">
        <div className="details-section">
          <div className="details-title">
            <h3>{product.name}</h3>
            <p className="gallery-item-date">{product.date}</p>
            <p>Media: {product.media}</p>
            {product.dimensions && (
              <p className="gallery-dimensions">Dimensions: {product.dimensions}</p>
            )}
            {product.description && (
              <div className="gallery-bio">
                <p>Description: {product.description}</p>
              </div>
            )}
          </div>
          <div className='view'>
            <div className="image-section">
              {product.image[currentImageIndex].includes('.mp4') ? (
                <video
                  className="gallery-video"
                  autoPlay
                  width="500"
                  playsInline
                  controls
                  src={product.image[currentImageIndex]}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={product.image[currentImageIndex]}
                  alt={product.name}
                  onClick={openModal}
                  style={{ cursor: 'pointer' }} // Add this for clickable images
                />
              )}
              {product.image.length > 1 && (
                <div className="thumbnail-row">
                  {product.image.map((image, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${index === currentImageIndex ? 'selected' : ''}`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      {image.includes('/videos/') ? (
                        <video playsInline controls={false}>
                          <source src={image} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img src={image} loading="lazy" alt={`${product.name} - Thumbnail ${index}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {product.image.length > 1 && (
              <div className="image-navigation">
                <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrevImage} className="prev" />
                <FontAwesomeIcon icon={faChevronRight} onClick={handleNextImage} className="next"/>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <FontAwesomeIcon icon={faTimes} onClick={closeModal} className="modal-close" />
            {product.image[currentImageIndex].includes('.mp4') ? (
              <video
                className="modal-video"
                autoPlay
                playsInline
                controls
                src={product.image[currentImageIndex]}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={product.image[currentImageIndex]}
                alt={product.name}
                className="modal-image"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryItemDetails;