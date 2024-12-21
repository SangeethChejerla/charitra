interface TreeItemProps {
  name: string;
  level: number;
  prefix: string;
  isLink?: boolean;
  icon?: React.ReactNode;
  url?: string;
  textSize?: string;
}

const TreeItem: React.FC<TreeItemProps> = ({
  name,
  level,
  prefix,
  isLink,
  icon,
  url,
  textSize = 'text-sm',
}) => {
  const indent = '  '.repeat(level);
  const connectorStyle = {
    marginLeft: `${(level - 1) * 10}px`,
    display: 'inline-block',
    width: '10px',
    textAlign: 'center',
    color: '#777',
  };

  return (
    <div
      className={`flex items-center ${textSize} ${
        isLink ? 'text-blue-300 hover:underline cursor-pointer' : ''
      }`}
    >
      <span
        //@ts-ignore
        style={connectorStyle}
      >
        {level > 0 ? prefix : ''}
      </span>
      {icon && <span className="mr-1">{icon}</span>}
      {isLink && url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1"
        >
          <span>{name}</span>
        </a>
      ) : (
        <span>{name}</span>
      )}
    </div>
  );
};

export default TreeItem;
