const ToastErrorContent = ({ errors }: { errors: string[] }) => {
  return (
    <ul>
      {errors.map((error, index) => (
        <li key={index}>- {error}</li>
      ))}
    </ul>
  );
};

export default ToastErrorContent;
