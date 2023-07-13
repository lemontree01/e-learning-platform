export const renderStarRating = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const renderFullStars = () => {
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }
    return stars;
  };

  return (
    <div>
      {renderFullStars()}
      {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
    </div>
  );
};