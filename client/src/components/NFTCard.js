const NFTCard = ({ item, children }) => {
  return (
    <div className="grid-item" id={item.tokenId}>
      <div className="header">
        <img src={item.url} alt={item.title} />
      </div>
      <div className="footer">
        <div className="info">
          <h3>{item.title}</h3>
          <p>{item.price}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export { NFTCard };
