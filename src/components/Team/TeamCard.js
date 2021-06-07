export const TeamCard = ({ fullname, title, linkedinUrl, imageUrl }) => {
  return (
    <div className="home-team__card">
      <img className="home-team__card-pic" src={imageUrl}/>
      <div className="home-team__card-bio">
        <h2>{fullname}</h2>
        <p>{title}</p>
        <a href={linkedinUrl}>
          <i class="fab fa-2x fa-linkedin-in"></i>
        </a>
      </div>
    </div>
  );
};